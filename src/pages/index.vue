<template>
  <v-container>
    <v-text-field
      v-model="filter"
      label="Filter rocket"
      class="mb-4"
    />

    <!-- Add Rocket -->
    <v-card class="pa-4 mb-6">
      <v-text-field v-model="form.name" label="Name" />
      <v-textarea v-model="form.description" label="Description" />
      <v-text-field v-model="form.image" label="Image URL" />
      <v-btn color="primary" @click="addRocket">Add Rocket</v-btn>
    </v-card>

    <LoadingState v-if="store.loading" />
    <ErrorState v-else-if="store.error" @retry="store.loadRockets" />

    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        md="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocket'
import RocketCard from '@/components/RocketCard.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const store = useRocketStore()
const filter = ref('')

const form = ref({
  name: '',
  description: '',
  image: '',
})

onMounted(() => {
  store.loadRockets()
})

const filteredRockets = computed(() =>
  store.rockets.filter(r =>
    r.name.toLowerCase().includes(filter.value.toLowerCase())
  )
)

function addRocket() {
  store.addRocket({
    id: Date.now().toString(),
    name: form.value.name,
    description: form.value.description,
    flickr_images: [form.value.image],
    cost_per_launch: 0,
    country: 'Custom',
    first_flight: '-',
  })

  form.value = { name: '', description: '', image: '' }
}
</script>
