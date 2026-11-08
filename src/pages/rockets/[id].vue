<script setup lang="ts">
/**
 * Rocket detail screen.
 *
 * Reads from the store first (the list response already has every detail field),
 * and only calls the single-rocket endpoint on a deep link / hard refresh.
 * Lifecycle: load on mount, reload when `:id` changes, abort on unmount.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ApiError, getErrorMessage, isAbortError } from '@/api/http'
import { isLocalRocketId } from '@/mappers/rocket.mapper'
import { useRocketsStore } from '@/stores/rockets'
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import type { RequestStatus } from '@/types/rocket'
import RocketImage from '@/components/rocket/RocketImage.vue'
import RocketSpecList from '@/components/rocket/RocketSpecList.vue'
import RocketStatusChips from '@/components/rocket/RocketStatusChips.vue'
import EmptyState from '@/components/state/EmptyState.vue'
import ErrorState from '@/components/state/ErrorState.vue'
import LoadingState from '@/components/state/LoadingState.vue'

const route = useRoute('/rockets/[id]')
const router = useRouter()
const store = useRocketsStore()

const rocketId = computed<string>(() => route.params.id ?? '')
const rocket = computed(() => store.getRocketById(rocketId.value) ?? null)

const status = ref<RequestStatus>('idle')
const errorMessage = ref<string | null>(null)
const isNotFound = ref(false)

useDocumentTitle(() => rocket.value?.name ?? (isNotFound.value ? 'Rocket not found' : null))

// ── Data loading ──
let controller: AbortController | null = null

async function loadRocket (): Promise<void> {
  controller?.abort()
  errorMessage.value = null
  isNotFound.value = false

  if (rocket.value) {
    status.value = 'success'
    return
  }

  // User-added rockets only exist in memory; API ids are always numeric.
  const id = rocketId.value
  if (isLocalRocketId(id) || !/^\d+$/.test(id)) {
    isNotFound.value = true
    status.value = 'success'
    return
  }

  controller = new AbortController()
  status.value = 'loading'
  try {
    await store.fetchRocketById(id, controller.signal)
    status.value = 'success'
  } catch (error) {
    if (isAbortError(error)) return
    if (error instanceof ApiError && error.kind === 'not-found') {
      isNotFound.value = true
      status.value = 'success'
      return
    }
    errorMessage.value = getErrorMessage(error)
    status.value = 'error'
  }
}

onMounted(loadRocket)
// Navigating away briefly clears the param before unmount, so ignore empty ids.
watch(rocketId, id => { if (id) loadRocket() })
onBeforeUnmount(() => controller?.abort())

// ── Navigation ──
/** Go back when we came from inside the app (keeps list filters and scroll), else go to the list. */
function goBack (): void {
  if (window.history.state?.back) router.back()
  else router.push('/')
}
</script>

<template>
  <article>
    <v-btn
      class="mb-6 ml-n2"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="goBack"
    >
      All rockets
    </v-btn>

    <LoadingState
      v-if="status === 'loading' || status === 'idle'"
      variant="detail"
    />

    <ErrorState
      v-else-if="status === 'error'"
      title="Couldn't load this rocket"
      :message="errorMessage ?? 'Please try again.'"
      @retry="loadRocket"
    />

    <EmptyState
      v-else-if="isNotFound || !rocket"
      icon="mdi-rocket-outline"
      title="Rocket not found"
      message="This rocket doesn't exist, or it was added in an earlier session."
    >
      <v-btn
        color="primary"
        to="/"
        variant="tonal"
      >
        Browse all rockets
      </v-btn>
    </EmptyState>

    <template v-else>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <div class="hero-image rounded-lg overflow-hidden border">
            <RocketImage
              :src="rocket.imageUrl"
              :alt="rocket.name"
              :aspect-ratio="4 / 3"
              eager
            />
          </div>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <RocketStatusChips :rocket="rocket" />

          <h1 class="text-h4 text-md-h3 font-weight-bold mt-4">
            {{ rocket.name }}
          </h1>
          <p
            v-if="rocket.manufacturer || rocket.family"
            class="text-subtitle-1 text-medium-emphasis mt-1"
          >
            {{ [rocket.manufacturer, rocket.family && `${rocket.family} family`].filter(Boolean).join(' · ') }}
          </p>

          <p
            class="text-body-1 mt-6 description"
            :class="{ 'text-medium-emphasis font-italic': !rocket.description }"
          >
            {{ rocket.description ?? 'No description available.' }}
          </p>

          <v-btn
            v-if="rocket.wikiUrl"
            :href="rocket.wikiUrl"
            append-icon="mdi-open-in-new"
            class="mt-4 px-0"
            color="primary"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          >
            Read more on Wikipedia
          </v-btn>
        </v-col>
      </v-row>

      <RocketSpecList
        class="mt-8"
        :rocket="rocket"
      />
    </template>
  </article>
</template>

<style scoped>
.hero-image {
  position: sticky;
  top: 88px;
}

.description {
  max-width: 65ch;
  line-height: 1.7;
}

@media (max-width: 959px) {
  .hero-image {
    position: static;
  }
}
</style>
