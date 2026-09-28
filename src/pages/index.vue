<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRocketStore } from '@/stores/rocket'
  import AsyncState from '@/components/AsyncState.vue'
  import RocketCard from '@/components/RocketCard.vue'
  import RocketForm from '@/components/RocketForm.vue'
  import type { NewRocketInput } from '@/types/rocket'

  const store = useRocketStore()
  const showAddDialog = ref(false)

  // Grid density: 'comfortable' shows fewer, bigger cards; 'compact' zooms
  // out to show more, smaller cards at once.
  const density = ref<'comfortable' | 'compact'>('comfortable')
  const cardCols = computed(() => density.value === 'comfortable'
    ? { cols: 12, sm: 6, md: 4 }
    : { cols: 6, sm: 4, md: 3 })

  onMounted(() => {
    if (store.status !== 'success') store.loadRockets()
  })

  function onAddRocket (input: NewRocketInput) {
    store.addRocket(input)
    showAddDialog.value = false
  }
</script>

<template>
  <v-container class="py-8">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <h1 class="text-h4">
        Rockets
      </h1>
      <div class="d-flex flex-wrap ga-4">
        <v-text-field
          v-model="store.filterText"
          clearable
          density="comfortable"
          hide-details
          label="Filter by name"
          prepend-inner-icon="mdi-magnify"
          style="min-width: 200px"
        />

        <v-select
          v-model="store.sortOrder"
          density="comfortable"
          hide-details
          :items="[
            { title: 'Name (A–Z)', value: 'asc' },
            { title: 'Name (Z–A)', value: 'desc' },
          ]"
          label="Sort by"
          style="min-width: 160px"
        />

        <v-btn-toggle
          v-model="density"
          color="primary"
          density="comfortable"
          mandatory
          variant="outlined"
        >
          <v-btn
            icon="mdi-magnify-minus-outline"
            title="Zoom out (more, smaller cards)"
            value="compact"
          />
          <v-btn
            icon="mdi-magnify-plus-outline"
            title="Zoom in (fewer, bigger cards)"
            value="comfortable"
          />
        </v-btn-toggle>

        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          variant="flat"
          @click="showAddDialog = true"
        >
          Add rocket
        </v-btn>
      </div>
    </div>

    <AsyncState
      :error-message="store.errorMessage"
      :status="store.status"
      @retry="store.loadRockets"
    >
      <v-alert
        v-if="store.filteredRockets.length === 0"
        type="info"
        variant="tonal"
      >
        No rockets match your filter.
      </v-alert>
      <v-row v-else>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          v-bind="cardCols"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </AsyncState>

    <v-dialog
      v-model="showAddDialog"
      max-width="520"
    >
      <v-card title="Add a rocket">
        <RocketForm
          @cancel="showAddDialog = false"
          @submit="onAddRocket"
        />
      </v-card>
    </v-dialog>
  </v-container>
</template>
