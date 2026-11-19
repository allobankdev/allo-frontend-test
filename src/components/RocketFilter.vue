<template>
  <v-card
    class="mb-6 pa-4"
    elevation="1"
    rounded="lg"
  >
    <v-row
      align="center"
      dense
    >
      <!-- Search Input -->
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="search"
          label="Search rockets..."
          placeholder="e.g. Falcon 9, Starship, Heavy..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
          @update:model-value="onSearchUpdate"
        />
      </v-col>

      <!-- Status Filter -->
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-btn-toggle
          v-model="status"
          mandatory
          divided
          variant="outlined"
          density="comfortable"
          color="primary"
          class="w-100 d-flex"
          @update:model-value="onStatusUpdate"
        >
          <v-btn
            value="all"
            class="flex-grow-1"
            size="small"
          >
            All
          </v-btn>
          <v-btn
            value="active"
            class="flex-grow-1"
            size="small"
          >
            Active
          </v-btn>
          <v-btn
            value="retired"
            class="flex-grow-1"
            size="small"
          >
            Retired
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <!-- Sort Selection -->
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-select
          v-model="sort"
          :items="sortOptions"
          item-title="title"
          item-value="value"
          label="Sort by"
          prepend-inner-icon="mdi-sort"
          variant="outlined"
          density="comfortable"
          hide-details
          @update:model-value="onSortUpdate"
        />
      </v-col>

      <!-- Add Rocket Button -->
      <v-col
        cols="12"
        md="2"
        class="text-right"
      >
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          block
          size="large"
          @click="$emit('open-add-dialog')"
        >
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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

const sortOptions = [
  { title: 'Name (A - Z)', value: 'name' },
  { title: 'First Flight (Newest)', value: 'flight' },
  { title: 'Launch Cost (Highest)', value: 'cost' },
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
