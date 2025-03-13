<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRocketStore } from '@/store/rocket'
import { storeToRefs } from 'pinia'
import AddRocketButton from '@/components/AddRocketButton.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'


const rocketStore = useRocketStore()
const { filteredRockets, loading, error } = storeToRefs(rocketStore)
const searchQuery = ref('')
const dialog = ref(false)


const addNewRocket = (newRocketData: any) => {
  rocketStore.addRocket(newRocketData)
}

onMounted(() => {
  rocketStore.fetchRockets();
})
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-4">Rocket List</h1>

    <!-- Search Input -->
     <v-text-field
      v-model="searchQuery"
      label="Search Rocket"
      variant="outlined"
      append-inner-icon="mdi-magnify"
      @input="rocketStore.filterRockets(searchQuery)"
      class="mb-4"
     ></v-text-field>

    <div class="mt-4 text-center">
      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    </div>

    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
      <v-btn class="ml-2" color="red" variant="flat" @click="rocketStore.fetchRockets()">Retry</v-btn>
    </v-alert>

    <v-row>
      <v-col v-for="rocket in filteredRockets" :key="rocket.id" cols="12" md="6" lg="4" class="d-flex">
        <v-card @click="$router.push(`/rocket/${rocket.id}`)">
          <v-img :src="rocket.flickr_images[0]" height="200" cover></v-img>
          <v-card-title>{{ rocket.name }}</v-card-title>
          <v-card-text>{{ rocket.description }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add New Rocket -->
    <AddRocketButton @open-dialog="dialog = true" />
    <AddRocketDialog v-model="dialog" @add-rocket="addNewRocket" />
  </v-container>
</template>