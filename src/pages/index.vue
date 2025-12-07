<template>
  <div class="d-flex flex-column gap-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <h1>Rockets</h1>
      <v-btn
        color="primary"
        @click="toggleForm"
      >
        {{ showForm ? 'Close Form' : 'Add Rocket' }}
      </v-btn>
    </div>

    <RocketForm
      v-if="showForm"
      @submit="handleAddRocket"
    />

    <v-text-field
      v-model="store.filterText"
      label="Filter rockets (name / country)"
      variant="outlined"
      clearable
      class="mb-4"
    />

    <div
      v-if="store.loading"
      class="d-flex justify-center my-10"
    >
      <v-progress-circular indeterminate />
    </div>

    <div
      v-else-if="store.error"
      class="text-center my-10"
    >
      <p class="mb-4">
        Failed to load rockets: {{ store.error }}
      </p>
      <v-btn
        color="primary"
        @click="store.loadRockets"
      >
        Retry
      </v-btn>
    </div>

    <v-row v-else>
      <v-col
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        cols="12"
        md="6"
        lg="4"
      >
        <div
          class="cursor-pointer"
          @click="goToDetail(rocket.id)"
        >
          <RocketCard :rocket="rocket" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>


<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRocketsStore } from '@/stores/rockets'
  import { useRouter } from 'vue-router'
  import RocketCard from '@/components/RocketCard.vue'
  import RocketForm from '@/components/RocketForm.vue'

  const store = useRocketsStore()
  const router = useRouter()

  const showForm = ref(false)

  onMounted(() => {
    if (!store.rockets.length) {
      store.loadRockets()
    }
  })

  function goToDetail(id: string) {
    router.push(`/rockets/${id}`)
  }

  function toggleForm() {
    showForm.value = !showForm.value
  }

  function handleAddRocket(payload: {
    name: string
    description: string
    country: string
    costPerLaunch: number
    firstFlight: string
    images: string[]
  }) {
    store.addRocket(payload)
    showForm.value = false
  }
</script>
  
  
