<template>
  <section class="filters">
    <div class="u-container filters__inner">
      <div class="filters__search">
        <v-text-field
          v-model="search"
          aria-label="Search rockets"
          density="compact"
          hide-details
          placeholder="Search Falcon, Starship, Heavy…"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          @update:model-value="onSearchUpdate"
        />
      </div>

      <div
        class="filters__status"
        role="group"
        aria-label="Filter by configuration status"
      >
        <v-btn-toggle
          v-model="status"
          mandatory
          class="status-toggle"
          color="primary"
          density="compact"
          variant="text"
          @update:model-value="onStatusUpdate"
        >
          <v-btn value="all">
            All
          </v-btn>
          <v-btn value="active">
            Active
          </v-btn>
          <v-btn value="retired">
            Retired
          </v-btn>
        </v-btn-toggle>
      </div>

      <div class="filters__sort">
        <v-select
          v-model="sort"
          aria-label="Sort rockets"
          density="compact"
          hide-details
          :items="sortOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
          @update:model-value="onSortUpdate"
        />
      </div>

      <v-btn
        class="filters__add"
        color="primary"
        prepend-icon="mdi-plus"
        @click="$emit('open-add-dialog')"
      >
        Add rocket
      </v-btn>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  initialSearch?: string;
  initialStatus?: 'all' | 'active' | 'retired';
  initialSort?: 'name' | 'flight' | 'cost';
}>();

const emit = defineEmits<{
  (e: 'update:search', val: string): void;
  (e: 'update:status', val: 'all' | 'active' | 'retired'): void;
  (e: 'update:sort', val: 'name' | 'flight' | 'cost'): void;
  (e: 'open-add-dialog'): void;
}>();

const search = ref(props.initialSearch || '');
const status = ref<'all' | 'active' | 'retired'>(props.initialStatus || 'all');
const sort = ref<'name' | 'flight' | 'cost'>(props.initialSort || 'name');

watch(
  () => [props.initialSearch, props.initialStatus, props.initialSort] as const,
  ([nextSearch, nextStatus, nextSort]) => {
    search.value = nextSearch || '';
    status.value = nextStatus || 'all';
    sort.value = nextSort || 'name';
  },
);

const sortOptions = [
  { title: 'Name A–Z', value: 'name' },
  { title: 'Newest first', value: 'flight' },
  { title: 'Highest cost', value: 'cost' },
];

function onSearchUpdate(val: string | null) {
  emit('update:search', val || '');
}

function onStatusUpdate(val: 'all' | 'active' | 'retired') {
  emit('update:status', val);
}

function onSortUpdate(val: 'name' | 'flight' | 'cost') {
  emit('update:sort', val);
}
</script>

<style scoped>
.filters {
  border-bottom: 1px solid var(--fleet-hairline);
  background: rgba(var(--v-theme-surface), 0.6);
}

.filters__inner {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto 190px auto;
  gap: 12px;
  align-items: center;
  padding-block: 16px;
}

.filters__search :deep(.v-field) {
  background: rgb(var(--v-theme-surface));
}

.filters__status :deep(.status-toggle) {
  border: 1px solid var(--fleet-hairline);
  background: rgb(var(--v-theme-surface));
  height: 40px;
}

.filters__status :deep(.v-btn) {
  font-family: var(--fleet-mono);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 0 !important;
  padding-inline: 16px;
  height: 40px;
  min-width: 76px;
}

.filters__status :deep(.v-btn + .v-btn) {
  border-left: 1px solid var(--fleet-hairline);
}

.filters__status :deep(.v-btn.v-btn--active) {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  opacity: 1;
}

.filters__status :deep(.v-btn.v-btn--active:hover) {
  background: rgb(var(--v-theme-primary)) !important;
}

.filters__sort :deep(.v-field) {
  background: rgb(var(--v-theme-surface));
}

.filters__add {
  height: 40px;
  font-family: var(--fleet-mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}

@media (max-width: 960px) {
  .filters__inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filters__search {
    grid-column: 1 / -1;
  }

  .filters__add {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .filters__inner {
    grid-template-columns: 1fr;
  }

  .filters__status {
    width: 100%;
  }

  .filters__status :deep(.status-toggle) {
    display: flex;
    width: 100%;
  }

  .filters__status :deep(.v-btn) {
    flex: 1;
  }
}
</style>
