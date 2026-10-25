<script lang="ts" setup>
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { mdiPlus, mdiRocketLaunch, mdiRocketLaunchOutline } from '@/constants/icons'
  import { useRocketStore } from '@/stores/useRocketStore'
  import type { NewRocketInput, Rocket } from '@/types/rocket'

  const PAGE_SIZE = 8
  // Artificial delay before revealing the next batch. The API always returns all 13
  // rockets in one request, so "load more" here just reveals more of what's already
  // in the store, not a new server request. This small delay only exists to make the
  // skeleton loading state visible, and keeps the UX consistent if the API is ever paginated.
  const LOAD_MORE_DELAY_MS = 400

  const rocketStore = useRocketStore()
  const router = useRouter()

  const visibleCount = ref(PAGE_SIZE)
  const isLoadingMore = ref(false)
  const sentinelRef = ref<HTMLElement | null>(null)
  const isAddDialogOpen = ref(false)

  const visibleRockets = computed(() => rocketStore.filteredRockets.slice(0, visibleCount.value))
  const hasMore = computed(() => visibleCount.value < rocketStore.filteredRockets.length)
  const nextBatchSize = computed(() => Math.min(PAGE_SIZE, rocketStore.filteredRockets.length - visibleCount.value))
  const existingRocketNames = computed(() => rocketStore.rockets.map(rocket => rocket.name))

  watch(() => rocketStore.filterText, () => {
    visibleCount.value = PAGE_SIZE
  })

  // IntersectionObserver only fires when isIntersecting changes, not on every layout
  // change — tracked manually here so loadMore() can be called again if the sentinel is
  // still visible after the new batch renders (otherwise reveal could stall on a very
  // tall/wide viewport).
  let isSentinelVisible = false

  async function loadMore () {
    if (isLoadingMore.value || !hasMore.value) return

    isLoadingMore.value = true
    await new Promise(resolve => setTimeout(resolve, LOAD_MORE_DELAY_MS))
    visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, rocketStore.filteredRockets.length)
    isLoadingMore.value = false

    if (isSentinelVisible) loadMore()
  }

  // rootMargin is intentionally small — on a short/wide viewport, a large margin can put
  // the sentinel inside the trigger zone with no scrolling at all, cascading straight
  // through to revealing every item on load.
  const observer = new IntersectionObserver(entries => {
    isSentinelVisible = entries[0]?.isIntersecting ?? false
    if (isSentinelVisible) loadMore()
  }, { rootMargin: '100px' })

  watch(sentinelRef, (el, previousEl) => {
    if (previousEl) observer.unobserve(previousEl)
    if (el) observer.observe(el)
  })

  onBeforeUnmount(() => observer.disconnect())

  onMounted(() => {
    if (rocketStore.status === 'idle') {
      rocketStore.fetchRockets()
    }
  })

  function goToDetail (rocket: Rocket) {
    router.push(`/rockets/${rocket.id}`)
  }

  function handleAddRocket (input: NewRocketInput) {
    rocketStore.addRocket(input)
  }
</script>

<template>
  <v-container
    class="py-8"
    max-width="1280"
  >
    <div class="mb-8">
      <v-chip
        class="mb-3"
        color="primary"
        :prepend-icon="mdiRocketLaunch"
        size="small"
        variant="tonal"
      >
        Launch Library 2 · SpaceX
      </v-chip>
      <h1 class="text-h4 font-weight-bold">
        Daftar Rocket SpaceX
      </h1>
      <p
        class="text-body-1 text-medium-emphasis mt-2"
        style="max-width: 640px;"
      >
        Jelajahi seluruh roket SpaceX dari Launch Library 2 API. Klik salah satu kartu untuk melihat detail lengkapnya.
      </p>
    </div>

    <AsyncState
      :error-message="rocketStore.errorMessage"
      :on-retry="rocketStore.fetchRockets"
      :status="rocketStore.status"
    >
      <template #loading>
        <v-row>
          <v-col
            v-for="n in PAGE_SIZE"
            :key="n"
            cols="12"
            lg="3"
            md="4"
            sm="6"
          >
            <RocketCardSkeleton />
          </v-col>
        </v-row>
      </template>

      <div class="d-flex flex-wrap ga-4 align-center mb-6">
        <RocketFilterField
          v-model="rocketStore.filterText"
          style="flex: 1 1 260px; max-width: 420px;"
        />
        <v-btn
          color="primary"
          :prepend-icon="mdiPlus"
          variant="flat"
          @click="isAddDialogOpen = true"
        >
          Tambah Rocket
        </v-btn>
      </div>

      <div
        v-if="rocketStore.filteredRockets.length === 0"
        class="d-flex flex-column align-center justify-center text-center py-16"
      >
        <v-icon
          class="mb-4 text-medium-emphasis"
          :icon="mdiRocketLaunchOutline"
          size="56"
        />
        <p class="text-body-1 text-medium-emphasis">
          <template v-if="rocketStore.filterText">
            Tidak ada rocket yang cocok dengan "{{ rocketStore.filterText }}".
          </template>
          <template v-else>
            Tidak ada rocket untuk ditampilkan.
          </template>
        </p>
      </div>
      <template v-else>
        <v-row>
          <v-col
            v-for="rocket in visibleRockets"
            :key="rocket.id"
            cols="12"
            lg="3"
            md="4"
            sm="6"
          >
            <RocketCard
              :rocket="rocket"
              @click="goToDetail"
            />
          </v-col>

          <template v-if="isLoadingMore">
            <v-col
              v-for="n in nextBatchSize"
              :key="`skeleton-${n}`"
              cols="12"
              lg="3"
              md="4"
              sm="6"
            >
              <RocketCardSkeleton />
            </v-col>
          </template>
        </v-row>

        <div
          ref="sentinelRef"
          class="pa-2"
        />
      </template>
    </AsyncState>

    <RocketFormDialog
      v-model="isAddDialogOpen"
      :existing-names="existingRocketNames"
      @submit="handleAddRocket"
    />
  </v-container>
</template>
