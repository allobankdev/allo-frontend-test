<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useRocketsStore, type Rocket } from '@/stores/rockets'
    
    const route = useRoute()
    const router = useRouter()
    const store = useRocketsStore()
    
    const rocket = ref<Rocket | null>(null)
    
    async function load() {
      const id = route.params.id as string
      try {
        const result = await store.fetchRocketIfNeeded(id)
        rocket.value = result
      } catch {

      }
    }
    
    onMounted(load)
    
    function goBack() {
      router.back()
    }
</script>
    
<template>
  <div>
    <v-btn
      variant="text"
      class="mb-4"
      @click="goBack"
    >
      ← Back
    </v-btn>

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
        Failed to load rocket: {{ store.error }}
      </p>
      <v-btn
        color="primary"
        @click="load"
      >
        Retry
      </v-btn>
    </div>
        

    <div
      v-else-if="rocket"
      class="rocket-detail"
    >
      <v-img
        :src="rocket.images[0]"
        class="mb-4 rocket-img"
        cover
      />

      <div>
        <h1 class="mb-2">
          {{ rocket.name }}
        </h1>
        <p class="mb-4">
          {{ rocket.description }}
        </p>

        <v-table>
          <tbody>
            <tr>
              <td>Country</td>
              <td>{{ rocket.country }}</td>
            </tr>
            <tr>
              <td>Cost per launch</td>
              <td>${{ rocket.costPerLaunch.toLocaleString() }}</td>
            </tr>
            <tr>
              <td>First flight</td>
              <td>{{ rocket.firstFlight }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>

    <div
      v-else
      class="text-center my-10"
    >
      <p>Rocket not found.</p>
    </div>
  </div>
</template>

<style scoped>
    .rocket-detail {
      max-width: 900px;
      margin: 0 auto;
    }
    
    .rocket-img {
      width: 100%;
      max-height: 500px;
    }
</style>