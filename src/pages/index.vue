<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">Rocket List</h1>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="showAddDialog = true"
          >
            Add Rocket
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6" lg="4">
        <RocketFilter />
      </v-col>
    </v-row>

    <v-row v-if="rocketStore.isLoading">
      <v-col cols="12">
        <LoadingState />
      </v-col>
    </v-row>

    <v-row v-else-if="rocketStore.isError">
      <v-col cols="12">
        <ErrorState
          :message="rocketStore.error || 'Failed to load rockets'"
          @retry="handleRetry"
        />
      </v-col>
    </v-row>

    <v-row v-else-if="rocketStore.isSuccess">
      <v-col
        v-if="rocketStore.filteredRockets.length === 0"
        cols="12"
        class="text-center py-8"
      >
        <v-icon size="64" color="grey" class="mb-4">
          mdi-rocket-launch
        </v-icon>
        <p class="text-h6 text-grey">No rockets found</p>
      </v-col>
      <v-col
        v-for="rocket in rocketStore.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard
          :rocket="rocket"
          @click="handleRocketClick(rocket.id)"
        />
      </v-col>
    </v-row>

    <AddRocketDialog v-model="showAddDialog" />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const router = useRouter()
const rocketStore = useRocketStore()
const showAddDialog = ref(false)

onMounted(async () => {
  if (rocketStore.rockets.length === 0) {
    await rocketStore.loadRockets()
  }
})

function handleRetry() {
  rocketStore.loadRockets()
}

function handleRocketClick(id: string) {
  router.push(`/rockets/${id}`)
}
</script>
