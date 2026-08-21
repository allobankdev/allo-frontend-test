<template>
  <div class="filter-card pa-3 mb-6 rounded-xl bg-white">
    <v-row align="center" dense>
      <!-- Search Input -->
      <v-col cols="12" md="7">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search SpaceX fleet..."
          placeholder="Search by rocket name, family, or description"
          variant="solo-filled"
          flat
          density="comfortable"
          hide-details
          clearable
          rounded="lg"
          class="custom-search-input"
          @update:model-value="onSearchUpdate"
        />
      </v-col>

      <!-- Status Filter Segment -->
      <v-col cols="12" sm="8" md="5" class="d-flex justify-md-end align-center mt-2 mt-md-0">
        <div class="segment-container d-flex align-center p-1 rounded-lg">
          <button
            type="button"
            class="segment-btn"
            :class="{ active: status === 'all' }"
            @click="onStatusUpdate('all')"
          >
            All Rockets
          </button>
          <button
            type="button"
            class="segment-btn"
            :class="{ active: status === 'active' }"
            @click="onStatusUpdate('active')"
          >
            Active
          </button>
          <button
            type="button"
            class="segment-btn"
            :class="{ active: status === 'inactive' }"
            @click="onStatusUpdate('inactive')"
          >
            Retired
          </button>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  initialSearch?: string
  initialStatus?: 'all' | 'active' | 'inactive'
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:status', value: 'all' | 'active' | 'inactive'): void
}>()

const search = ref(props.initialSearch || '')
const status = ref<'all' | 'active' | 'inactive'>(props.initialStatus || 'all')

// Sync local refs when props change (e.g. when parent or store resets filters)
watch(
  () => props.initialSearch,
  (newVal) => {
    search.value = newVal || ''
  }
)

watch(
  () => props.initialStatus,
  (newVal) => {
    status.value = newVal || 'all'
  }
)

function onSearchUpdate(val: string | null) {
  emit('update:search', val || '')
}

function onStatusUpdate(val: 'all' | 'active' | 'inactive') {
  status.value = val
  emit('update:status', val)
}
</script>

<style scoped>
.filter-card {
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.custom-search-input :deep(.v-field) {
  background-color: #f8fafc !important;
  border: 1px solid #e2e8f0;
  color: #0f172a;
}

.custom-search-input :deep(.v-field:hover) {
  border-color: #cbd5e1;
}

.custom-search-input :deep(.v-field--focused) {
  border-color: #0f172a !important;
  background-color: #ffffff !important;
}

.segment-container {
  background-color: #f1f5f9;
  padding: 3px;
  gap: 2px;
}

.segment-btn {
  border: none;
  background: transparent;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.segment-btn:hover {
  color: #0f172a;
}

.segment-btn.active {
  background: #ffffff;
  color: #0f172a;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
</style>
