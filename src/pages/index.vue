<template>
  <v-container
    class="py-8"
    max-width="1280"
  >
    <div class="d-flex flex-wrap align-center ga-4 mb-8">
      <div>
        <h1 class="text-h3 font-weight-bold">
          SpaceX rockets
        </h1><p class="text-medium-emphasis">
          Explore launch vehicles from SpaceX.
        </p>
      </div><v-spacer /><AddRocketDialog @added="onAdded" />
    </div>
    <v-text-field
      v-model="query"
      aria-label="Filter rockets"
      clearable
      hide-details
      label="Filter by name or description"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
    />
    <LoadState
      v-if="store.loading || (store.error && !store.hasRockets)"
      :error="store.error"
      :loading="store.loading"
      @retry="store.fetchRockets(true)"
    />
    <template v-else>
      <v-alert
        v-if="store.error"
        class="mt-6"
        closable
        type="warning"
      >
        Refresh failed: {{ store.error }} <v-btn
          size="small"
          variant="text"
          @click="store.fetchRockets(true)"
        >
          Retry
        </v-btn>
      </v-alert>
      <p class="my-5 text-medium-emphasis">
        {{ filtered.length }} rocket{{ filtered.length === 1 ? '' : 's' }}
      </p>
      <v-row v-if="filtered.length">
        <v-col
          v-for="rocket in filtered"
          :key="rocket.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
      <v-empty-state
        v-else
        icon="mdi-rocket-outline"
        title="No rockets found"
        text="Try another filter or add a rocket."
      />
    </template>
  </v-container>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AddRocketDialog from '@/components/AddRocketDialog.vue'; import LoadState from '@/components/LoadState.vue'; import RocketCard from '@/components/RocketCard.vue'; import { useRocketStore } from '@/stores/rockets'
const store = useRocketStore(); const router = useRouter(); const query = ref('')
const filtered = computed(() => { const term = query.value.toLowerCase().trim(); return term ? store.rockets.filter(r => `${r.full_name ?? ''} ${r.description ?? ''}`.toLowerCase().includes(term)) : store.rockets })
function onAdded (id: string) { router.push(`/rockets/${id}`) }
onMounted(() => store.fetchRockets())
</script>
