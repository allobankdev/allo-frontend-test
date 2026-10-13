<template>
  <div class="rocket-list-page py-6">
    <v-container>
      <!-- Hero / Section Header -->
      <div class="page-header mb-6">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center gap-3">
          <div>
            <div class="text-caption text-uppercase tracking-widest text-grey font-weight-medium mb-1">
              SpaceX Launch Vehicles
            </div>
            <h1 class="text-h4 font-weight-bold text-white tracking-tight">
              Katalog Roket
            </h1>
          </div>

          <v-btn
            variant="flat"
            color="white"
            prepend-icon="mdi-plus"
            class="text-black font-weight-bold text-none"
            @click="isAddModalOpen = true"
          >
            Tambah Roket Baru
          </v-btn>
        </div>
      </div>

      <!-- Filter & Search Controls -->
      <RocketFilter />

      <!-- UI STATE 1: LOADING -->
      <UIStateLoading v-if="store.isLoading" />

      <!-- UI STATE 2: ERROR / RETRY -->
      <UIStateError
        v-else-if="store.error"
        :message="store.error"
        @retry="store.fetchRockets(true)"
      />

      <!-- UI STATE 3: SUCCESS -->
      <div v-else>
        <!-- If results found -->
        <v-row v-if="store.filteredRockets.length > 0">
          <v-col
            v-for="rocket in store.filteredRockets"
            :key="rocket.id"
            cols="12"
            sm="6"
            lg="4"
          >
            <RocketCard :rocket="rocket" />
          </v-col>
        </v-row>

        <!-- If no results match search/filter -->
        <UIStateEmpty
          v-else
          @reset="store.resetFilters"
        />
      </div>

      <!-- Modal Tambah Roket -->
      <RocketAddDialog
        v-model="isAddModalOpen"
        @created="handleRocketCreated"
      />

      <!-- Success Notification Snackbar -->
      <v-snackbar
        v-model="showSnackbar"
        :timeout="3500"
        color="#18181b"
        variant="flat"
        class="border-subtle"
        location="bottom right"
      >
        <div class="d-flex align-center gap-2 text-white">
          <v-icon
            icon="mdi-check-circle-outline"
            color="white"
            size="20"
          />
          <span>Roket baru berhasil ditambahkan!</span>
        </div>

        <template #actions>
          <v-btn
            color="white"
            variant="text"
            size="small"
            @click="showSnackbar = false"
          >
            Tutup
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rockets'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import RocketAddDialog from '@/components/RocketAddDialog.vue'
import UIStateLoading from '@/components/UIStateLoading.vue'
import UIStateError from '@/components/UIStateError.vue'
import UIStateEmpty from '@/components/UIStateEmpty.vue'

const store = useRocketStore()
const isAddModalOpen = ref(false)
const showSnackbar = ref(false)

onMounted(() => {
  store.fetchRockets()
})

function handleRocketCreated() {
  showSnackbar.value = true
}
</script>

<style scoped>
.rocket-list-page {
  min-height: calc(100vh - 65px);
}

.tracking-tight {
  letter-spacing: -0.02em;
}

.tracking-widest {
  letter-spacing: 0.15em;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.border-subtle {
  border: 1px solid #333338;
}
</style>
