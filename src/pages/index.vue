<template>
  <v-container class="py-6">
    <div class="toolbar">
      <v-text-field
        :model-value="filterText"
        @update:model-value="onFilter"
        prepend-inner-icon="mdi-magnify"
        label="Filter by name, country, or text…"
        variant="outlined"
        hide-details
        density="comfortable"
        class="search"
      />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="showAdd = true">Add Rocket</v-btn>
      <v-btn variant="tonal" prepend-icon="mdi-refresh" :loading="loading" @click="refresh">Refresh</v-btn>
    </div>

    <AddRocketModal v-model="showAdd" @submit="addRocket" />

    <v-row v-if="loading" dense>
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, article, actions" class="rounded-xl" elevation="4" />
      </v-col>
    </v-row>

    <div v-else-if="error" class="d-flex flex-column align-center justify-center text-center my-10">
      <v-icon size="64" color="error" class="mb-2">mdi-alert-circle</v-icon>
      <div class="text-h6 mb-1">Failed to load rockets</div>
      <div class="text-body-2 mb-4 text-medium-emphasis">{{ error }}</div>
      <v-btn color="error" prepend-icon="mdi-reload" @click="retry">Retry</v-btn>
    </div>

    <template v-else>
      <div class="text-body-2 text-medium-emphasis mb-2">Found {{ rockets.length }} rockets</div>

      <div v-if="rockets.length === 0" class="d-flex flex-column align-center justify-center text-center my-10">
        <v-icon size="56" class="mb-2">mdi-rocket-launch-outline</v-icon>
        <div class="text-subtitle-1 mb-2">No rockets found</div>
        <div class="text-body-2 text-medium-emphasis">Try changing the filter or add a new one.</div>
      </div>

      <v-row v-else dense>
        <v-col v-for="r in rockets" :key="r.id" cols="12" sm="6" md="4" lg="3">
          <RocketCard :rocket="r" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRocketsStore } from '../composables/useRocketsStore'


const store = useRocketsStore()
const { loading, error, filtered, filterText } = storeToRefs(store)
const rockets = computed(() => filtered.value)
const showAdd = ref(false)

onMounted(() => { if (store.items.length === 0) store.fetchRockets() })
const onFilter = (v: string) => store.setFilter(v)
const retry = () => store.retry()
const refresh = () => store.fetchRockets()
const addRocket = (payload: any) => store.addLocal(payload)
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;              
  margin-bottom: 16px;    
}

.search {
  flex: 1 1 580px;   
  min-width: 260px;       
}

.search :deep(.v-field) {
  border-radius: 12px;
}

@media (max-width: 720px) {
  .toolbar { justify-content: flex-start; }
  .search { flex-basis: 100%; }
}
</style>
