<template>
  <v-container class="py-8">
    <v-row class="align-center mb-6">
      <v-col cols="12" md="6" class="d-flex align-center gap-3">
        <v-icon icon="mdi-rocket-launch-outline" size="x-large" color="primary" />
        <div>
          <div class="text-h5 font-weight-bold">Rockets</div>
          <div class="text-body-2 text-medium-emphasis">Browse SpaceX rockets or add your own entries</div>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end gap-3">
        <v-text-field
          v-model="localFilter"
          label="Filter by name"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          class="flex-1"
        />
        <RocketAddDialog
          v-model="dialog"
          @save="handleAdd"
        />
      </v-col>
    </v-row>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      :text="error"
    >
      <template #append>
        <v-btn
          color="primary"
          size="small"
          variant="text"
          prepend-icon="mdi-reload"
          @click="retry"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <div v-if="isLoading" class="mb-4">
      <v-skeleton-loader
        v-for="n in 3"
        :key="n"
        type="card"
        class="mb-2"
      />
    </div>

    <v-row v-else-if="rockets.length">
      <v-col
        v-for="rocket in rockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard
          :rocket="rocket"
          @select="openDetail"
        />
      </v-col>
    </v-row>

    <v-empty-state
      v-else
      headline="No rockets found"
      title="Try adjusting the filter or add a new rocket"
      action-text="Reset filter"
      @click:action="resetFilter"
    />
  </v-container>
</template>

<script setup lang="ts">
import RocketAddDialog from '@/components/RocketAddDialog.vue'
import RocketCard from '@/components/RocketCard.vue'
import { useRocketsStore } from '@/stores/rockets'
import type { RocketCreateInput } from '@/types/rocket'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useRocketsStore()
const { filteredRockets, status, error, filter } = storeToRefs(store)

const dialog = ref(false)
const localFilter = ref(filter.value)

const isLoading = computed(() => status.value === 'loading')
const rockets = computed(() => filteredRockets.value)

onMounted(() => {
  store.loadRockets()
})

watch(localFilter, (value) => {
  store.setFilter(value || '')
})

function openDetail (id: string) {
  router.push({ path: `/rockets/${id}` })
}

function handleAdd (payload: RocketCreateInput) {
  store.addRocket(payload)
}

function retry () {
  store.loadRockets(true)
}

function resetFilter () {
  localFilter.value = ''
  store.setFilter('')
}
</script>
