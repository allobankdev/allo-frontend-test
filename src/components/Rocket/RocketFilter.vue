<template>
    <div class="rocket-filter">
        <div class="filter-row">
            <!-- Search Input -->
            <div class="filter-group search-group">
                <label for="search" class="filter-label">Search</label>
                <input id="search" type="text" v-model="localFilters.searchQuery" @input="handleSearchInput"
                    placeholder="Search rocket name..." class="filter-input" />
            </div>

            <!-- Active Status Filter -->
            <div class="filter-group">
                <label for="status" class="filter-label">Status</label>
                <select id="status" v-model="localFilters.activeStatus" @change="handleFilterChange"
                    class="filter-select">
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <!-- Sort By -->
            <div class="filter-group">
                <label for="sort" class="filter-label">Sort By</label>
                <select id="sort" v-model="localFilters.sortBy" @change="handleFilterChange" class="filter-select">
                    <option value="name">Name</option>
                    <option value="cost">Cost</option>
                    <option value="date">First Flight</option>
                </select>
            </div>

            <!-- Reset Button -->
            <div class="filter-group">
                <label class="filter-label">&nbsp;</label>
                <button @click="handleReset" class="reset-button">
                    Reset Filters
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FilterState } from '@/types/rocket'

interface Props {
    filters: FilterState
}

interface Emits {
    (e: 'update:filters', filters: FilterState): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localFilters = ref<FilterState>({ ...props.filters })
const debounceTimer = ref<number | null>(null)

watch(() => props.filters, (newFilters) => {
    localFilters.value = { ...newFilters }
}, { deep: true })

const handleFilterChange = () => {
    emit('update:filters', { ...localFilters.value })
}

const handleSearchInput = () => {
    if (debounceTimer.value) {
        clearTimeout(debounceTimer.value)
    }

    debounceTimer.value = window.setTimeout(() => {
        emit('update:filters', { ...localFilters.value })
    }, 1000)
}

const handleReset = () => {
    localFilters.value = {
        searchQuery: '',
        activeStatus: 'all',
        sortBy: 'name'
    }
    handleFilterChange()
}
</script>

<style scoped>
.rocket-filter {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.filter-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 1rem;
    align-items: end;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: #374151;
}

.search-group {
    flex: 1;
}

.filter-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
}

.filter-input,
.filter-select {
    padding: 0.625rem 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: border-color 0.2s;
    background: white;
    color: #374151;
}

.filter-input:focus,
.filter-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-input::placeholder {
    color: #9ca3af;
}

.reset-button {
    padding: 0.625rem 1.25rem;
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.reset-button:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
}

/* Responsive */
@media (max-width: 1024px) {
    .filter-row {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .filter-row {
        grid-template-columns: 1fr;
    }
}
</style>