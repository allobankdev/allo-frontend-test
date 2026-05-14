<template>
  <v-container>
    <v-row
      align="center"
      class="mb-4"
    >
      <v-col>
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="showAddDialog = true"
        >
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          v-model="store.searchQuery"
          label="Search rockets..."
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        class="d-flex align-center"
      >
        <v-btn-toggle
          v-model="store.activeFilter"
          mandatory
          variant="outlined"
          divided
          density="compact"
        >
          <v-btn value="all">
            All
          </v-btn>
          <v-btn value="active">
            Active
          </v-btn>
          <v-btn value="inactive">
            Inactive
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <div
      v-if="store.loading"
      class="d-flex justify-center align-center"
      style="min-height: 300px;"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <v-alert
      v-else-if="store.error"
      type="error"
      class="mb-4"
    >
      {{ store.error }}
      <template #append>
        <v-btn
          variant="text"
          @click="store.loadRockets()"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <template v-else>
      <v-row v-if="store.filteredRockets.length">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <RocketCard
            :rocket="rocket"
            class="rocket-card-clickable"
            @click="goToDetail(rocket.id)"
          />
        </v-col>
      </v-row>
      <v-empty-state
        v-else
        icon="mdi-rocket-off"
        title="No rockets found"
        text="Try adjusting your search or filters."
      />
    </template>

    <AddRocketDialog
      v-model="showAddDialog"
      @add="store.addRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/useRocketStore'
import RocketCard from '@/components/RocketCard.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const store = useRocketStore()
const router = useRouter()

const showAddDialog = ref(false)

function goToDetail (id: string) {
  router.push(`/rockets/${id}`)
}

onMounted(() => {
  if (!store.rockets.length) {
    store.loadRockets()
  }
})
</script>

<style scoped>
.rocket-card-clickable {
  cursor: pointer;
}
</style>
