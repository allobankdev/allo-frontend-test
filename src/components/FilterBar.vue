<template>
  <v-row>
    <v-col>
      <v-text-field
        v-model="searchQuery"
        :label="searchLabel"
        :placeholder="searchPlaceholder"
        variant="outlined"
        :density="density"
        :clearable="clearable"
        hide-details="auto"
        @update:model-value="handleInput"
      />
    </v-col>
    <v-col>
      <v-select
        v-model="selectedCountry"
        :items="countryItems"
        :label="countryLabel"
        :placeholder="countryPlaceholder"
        variant="outlined"
        :density="density"
        :clearable="clearable"
        hide-details="auto"
        @update:model-value="handleInput"
      >
        <template #selection="{ item, index }">
          <v-chip
            v-if="index === 0"
            size="small"
            class="text-truncate"
            :max-width="maxChipWidth"
          >
            {{ item.title }}
          </v-chip>
        </template>
      </v-select>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useFilter, type FilterOptions } from '@/composables/useFilter';

const props = withDefaults(defineProps<{
  modelValue?: FilterOptions;
  searchLabel?: string;
  searchPlaceholder?: string;
  countryLabel?: string;
  countryPlaceholder?: string;
  countries?: string[];
  showSearch?: boolean;
  showCountry?: boolean;
  dense?: boolean;
  clearable?: boolean;
  cols?: {
    search?: number | string | boolean;
    country?: number | string | boolean;
  };
  maxChipWidth?: number | string;
}>(), {
  modelValue: undefined,
  searchLabel: 'Search',
  searchPlaceholder: 'Type to search...',
  countryLabel: 'Country',
  countryPlaceholder: 'Select country',
  countries: () => [],
  showSearch: true,
  showCountry: true,
  dense: false,
  clearable: true,
  cols: () => ({
    search: 12,
    country: 6,
  }),
  maxChipWidth: 120,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterOptions): void;
  (e: 'change', value: FilterOptions): void;
}>();

const { searchQuery, selectedCountry, debounceEmit } = useFilter(props.modelValue);

const density = computed(() => (props.dense ? 'compact' : 'default'));

const countryItems = computed(() => [
  { title: 'All Countries', value: '' },
  ...props.countries.map(country => ({
    title: country,
    value: country.toLowerCase(),
  })),
]);

const handleInput = () => {
  debounceEmit((filters) => {
    emit('update:modelValue', filters);
    emit('change', filters);
  });
};

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    searchQuery.value = newValue.search || '';
    selectedCountry.value = newValue.country || '';
  }
}, { deep: true });
</script>
