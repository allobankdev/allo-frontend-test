<template>
  <div class="d-flex flex-column gap-4">
    <h1>Rockets</h1>

    <v-text-field
      v-model="store.filterText"
      label="Filter rockets (name / country)"
      variant="outlined"
      clearable
    />

    <div v-if="store.loading" class="d-flex justify-center my-10">
      <v-progress-circular indeterminate />
    </div>

    <div v-else-if="store.error" class="text-center my-10">
      <p class="mb-4">Failed to load rockets: {{ store.error }}</p>
      <v-btn color="primary" @click="store.loadRockets">
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
        <v-card
          class="h-100 d-flex flex-column"
          @click="goToDetail(rocket.id)"
          hover
        >
          <v-img
            :src="rocket.images[0]"
            height="200"
            cover
          />
          <v-card-item>
            <v-card-title>{{ rocket.name }}</v-card-title>
            <v-card-subtitle>{{ rocket.country }}</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            {{ rocket.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRocketsStore } from '@/stores/rockets'
  import { useRouter } from 'vue-router'
  
  const store = useRocketsStore()
  const router = useRouter()
  
  onMounted(() => {
    if (!store.rockets.length) {
      store.loadRockets()
    }
  })
  
  function goToDetail(id: string) {
    router.push(`/rockets/${id}`)
  }
</script>
  
