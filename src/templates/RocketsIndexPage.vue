<template>
  <v-container class="py-4 py-sm-6">
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-4">
      <div>
        <div class="text-h5 font-weight-bold">Rockets</div>
        <div class="text-body-2 text-medium-emphasis">
          Browse SpaceX rockets and view details.
        </div>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        :block="addButtonBlock"
        @click="addDialog = true"
      >
        Add rocket
      </v-btn>
    </div>

    <v-sheet class="sticky-filters mb-2" color="surface" border rounded="lg">
      <v-row class="pa-2" dense>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="search"
            label="Search rockets"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="activeFilter"
            :items="activeFilterItems"
            label="Status"
            variant="outlined"
            hide-details
          />
        </v-col>
      </v-row>
    </v-sheet>

    <v-progress-linear
      v-if="listStatus === 'loading' && !showInitialSkeleton"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <UiErrorRetry
      v-if="listStatus === 'error' && apiRockets.length === 0"
      :message="listError"
      @retry="reload(true)"
    />

    <div
      v-else-if="listStatus === 'success' && rockets.length === 0"
      class="text-body-2 text-medium-emphasis"
    >
      <div>No rockets found.</div>
      <v-btn
        v-if="hasActiveFilters"
        class="mt-3"
        variant="tonal"
        prepend-icon="mdi-filter-remove-outline"
        @click="clearFilters"
      >
        Clear filters
      </v-btn>
    </div>

    <template v-else>
      <v-row v-if="showInitialSkeleton" dense>
        <v-col v-for="i in 6" :key="i" cols="12" sm="6" lg="4">
          <v-skeleton-loader type="image, article" />
        </v-col>
      </v-row>

      <v-row v-if="rockets.length" dense>
        <v-col v-for="r in rockets" :key="r.id" cols="12" sm="6" lg="4">
          <RocketCard :rocket="r" :to="`/rockets/${r.id}`" />
        </v-col>
      </v-row>

      <div ref="sentinel" class="py-6">
        <UiErrorRetry
          v-if="appendStatus === 'error'"
          :message="appendError"
          @retry="loadMore"
        />

        <div v-else class="d-flex justify-center">
          <v-progress-circular
            v-if="appendStatus === 'loading'"
            indeterminate
            color="primary"
          />

          <v-btn
            v-else-if="hasNextPage"
            variant="text"
            prepend-icon="mdi-chevron-down"
            @click="loadMore"
          >
            Load more
          </v-btn>

          <div v-else class="text-body-2 text-medium-emphasis">
            You’ve reached the end.
          </div>
        </div>
      </div>
    </template>

    <v-dialog
      v-model="addDialog"
      :fullscreen="dialogFullscreen"
      :max-width="dialogMaxWidth"
      scrollable
    >
      <v-card rounded="lg">
        <v-card-title class="text-h6">Add new rocket</v-card-title>

        <v-card-text>
          <v-form>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRocket.name"
                  label="Name"
                  variant="outlined"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="newRocket.cost_per_launch"
                  label="Cost per launch (USD)"
                  type="number"
                  min="0"
                  variant="outlined"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRocket.country"
                  label="Country"
                  variant="outlined"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRocket.first_flight"
                  label="First flight (YYYY-MM-DD)"
                  type="date"
                  variant="outlined"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newRocket.imageUrl"
                  label="Image URL (optional)"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="newRocket.description"
                  label="Description"
                  variant="outlined"
                  rows="3"
                  auto-grow
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="newRocket.active"
                  color="success"
                  label="Active"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="addDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!canSubmit"
            @click="submitNewRocket"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
export default {
  name: "RocketsIndexPage",
};
</script>

<script lang="ts" setup>
import { useRocketsIndexPage } from "@/composables/pages/useRocketsIndexPage";

const {
  addButtonBlock,
  dialogFullscreen,
  dialogMaxWidth,
  search,
  activeFilter,
  activeFilterItems,
  rockets,
  apiRockets,
  listStatus,
  listError,
  appendStatus,
  appendError,
  hasNextPage,
  sentinel,
  showInitialSkeleton,
  hasActiveFilters,
  addDialog,
  newRocket,
  canSubmit,
  reload,
  loadMore,
  clearFilters,
  submitNewRocket,
} = useRocketsIndexPage();
</script>

<style scoped>
.sticky-filters {
  position: sticky;
  top: 0;
  z-index: 5;
}
</style>
