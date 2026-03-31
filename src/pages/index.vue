<template>
  <v-container>
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="8">
        <v-text-field
          v-model="store.searchQuery"
          label="Search Rockets"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn color="primary" @click="dialog = true" prepend-icon="mdi-plus">
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-alert
      v-if="store.error"
      type="error"
      title="Error Loading Data"
      :text="store.error"
      class="mb-4"
    >
      <template v-slot:append>
        <v-btn color="white" variant="text" @click="store.fetchRockets()">Retry</v-btn>
      </template>
    </v-alert>

    <!-- Loading State -->
    <v-row v-if="store.isLoading" justify="center" class="my-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

    <!-- Success State -->
    <v-row v-else-if="!store.error">
      <v-col
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
      <v-col v-if="store.filteredRockets.length === 0" cols="12" class="text-center text-grey my-10">
        No rockets found matching your search.
      </v-col>
    </v-row>

    <!-- Add Rocket Dialog -->
    <AddRocketDialog v-model="dialog" @save="onAddRocket" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRocketStore, type Rocket } from '@/stores/rocketStore'
import RocketCard from '@/components/RocketCard.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const store = useRocketStore()
const dialog = ref(false)

onMounted(() => {
  store.fetchRockets()
})

function onAddRocket(newRocket: Rocket) {
  store.addManualRocket(newRocket)
  dialog.value = false
}
</script>
