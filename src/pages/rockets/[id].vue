<template>
  <v-container class="py-8">
    <v-btn
      class="mb-4"
      variant="text"
      prepend-icon="mdi-arrow-left"
      @click="goBack"
    >
      Back to list
    </v-btn>

    <div
      v-if="isLoading"
      class="d-flex justify-center py-8"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>

    <div
      v-else-if="errorMessage"
      class="text-center py-8"
    >
      <p class="mb-4">
        {{ errorMessage }}
      </p>
      <v-btn
        color="primary"
        @click="loadRocket"
      >
        Retry
      </v-btn>
    </div>

    <div v-else-if="rocket">
      <RocketDetailInfo :rocket="rocket" />
    </div>

    <div
      v-else
      class="text-center py-8"
    >
      <p>Rocket not found.</p>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  //
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useRocketStore } from '@/stores/rocket'
  import type { Rocket } from '@/services/spacexService'
  import { fetchRocketById } from '@/services/spacexService'
  import RocketDetailInfo from '@/components/RocketDetailInfo.vue'

  const route = useRoute()
  const router = useRouter()
  const rocketStore = useRocketStore()

  const rocket = ref<Rocket | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const goBack = () => {
    router.push({ path: '/' })
  }

  const loadRocket = async () => {
    const id = String(route.params.id)

    isLoading.value = true
    errorMessage.value = ''

    const fromStore = rocketStore.getRocketById(id)

    if (fromStore) {
      rocket.value = fromStore
      isLoading.value = false
      return
    }

    try {
      const result = await fetchRocketById(id)
      rocket.value = result
    } catch (error: unknown) {
      let message = 'Failed to load rocket detail'

      if (error instanceof Error) {
        message = error.message
      } else if (typeof error === 'string') {
        message = error
      }

      errorMessage.value = message
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    loadRocket()
  })
</script>
