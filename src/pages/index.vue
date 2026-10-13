<script setup lang="ts">
import { useRocketListPage } from "@/composables/pages/useRocketListPage";
import RocketCard from "@/components/RocketCard.vue";
import AddRocketDialog from "@/components/AddRocketDialog.vue";

const {
  state,
  filteredRockets,
  isAddDialogOpen,
  retry,
  setFilterText,
  openAddDialog,
  handleAddRocket,
} = useRocketListPage();
</script>

<template>
  <div>
    <div class="mb-5">
      <h1 class="text-h5 font-weight-medium mb-1">
        Rockets
      </h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        {{ state.rockets.length }} launch vehicle{{
          state.rockets.length === 1 ? "" : "s"
        }}
        from SpaceX
      </p>
    </div>

    <div class="d-flex flex-wrap ga-4 mb-6">
      <v-text-field
        :model-value="state.filterText"
        label="Filter rockets by name"
        prepend-inner-icon="mdi-magnify"
        density="comfortable"
        hide-details
        clearable
        class="flex-grow-1"
        style="min-width: 220px"
        @update:model-value="(value: string) => setFilterText(value)"
      />
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="openAddDialog"
      >
        Add rocket
      </v-btn>
    </div>

    <div
      v-if="state.status === 'loading'"
      class="text-center py-16"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="40"
      />
      <p class="text-medium-emphasis mt-4">
        Loading rockets…
      </p>
    </div>

    <v-alert
      v-else-if="state.status === 'error'"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      <p class="mb-3">
        {{ state.error || "Couldn't load rockets." }}
      </p>
      <v-btn
        color="error"
        variant="flat"
        @click="retry"
      >
        Retry
      </v-btn>
    </v-alert>

    <v-alert
      v-else-if="filteredRockets.length === 0"
      type="info"
      variant="tonal"
    >
      {{
        state.filterText
          ? `No rockets match "${state.filterText}".`
          : "No rockets to show yet."
      }}
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="handleAddRocket"
    />
  </div>
</template>
