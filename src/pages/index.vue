<template>
  <v-container class="py-6">
    <v-sheet
      rounded="lg"
      class="toolbar-sheet pa-4 mb-6"
    >
      <div class="d-flex align-center ga-4">
        <v-text-field
          v-model="store.filterKeyword"
          label="Search Rockets"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="flex-grow-1"
          @click:clear="store.filterKeyword = ''"
        />
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          variant="elevated"
          @click="showAddDialog = true"
        >
          Add Rocket
        </v-btn>
      </div>
    </v-sheet>

    <!-- Loading / Idle -->
    <AppLoader v-if="store.status === 'idle' || store.status === 'loading'" />

   
    <AppErrorRetry
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="store.fetchRockets()"
    />

    <template v-else>
      <p
        v-if="store.filteredRockets.length === 0"
        class="text-medium-emphasis text-center py-8"
      >
        No rockets found.
      </p>
      <v-row v-else>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard
            :rocket="rocket"
            @click="goToDetail(rocket.id)"
          />
        </v-col>
      </v-row>
    </template>

    <AddRocketDialog
      v-model="showAddDialog"
      @submit="store.addLocalRocket($event)"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import AppLoader from '@/components/common/AppLoader.vue'
import AppErrorRetry from '@/components/common/AppErrorRetry.vue'
import RocketCard from '@/components/rocket/RocketCard.vue'
import AddRocketDialog from '@/components/rocket/AddRocketDialog.vue'

const router = useRouter()
const store = useRocketStore()
const showAddDialog = ref(false)

function goToDetail(id: string) {
  router.push({ path: `/rocket/${id}` })
}

onMounted(() => {
  if (store.apiRockets.length === 0) {
    store.fetchRockets()
  }
})
</script>

<style scoped>
.toolbar-sheet {
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
