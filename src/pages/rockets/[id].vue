<template>
  <v-container class="py-8">
    <v-btn
      class="mb-6"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="router.push('/')"
    >
      Back to list
    </v-btn>

    <AsyncState
      :error-message="store.detailError"
      loading-message="Loading rocket details..."
      :status="store.detailStatus"
      @retry="loadDetail"
    >
      <RocketDetailContent
        v-if="store.selectedRocket"
        :rocket="store.selectedRocket"
      />
    </AsyncState>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import RocketDetailContent from '@/components/rockets/RocketDetailContent.vue'
  import AsyncState from '@/components/ui/AsyncState.vue'
  import { useRocketsStore } from '@/stores/rockets'

  const route = useRoute('/rockets/[id]')
  const router = useRouter()
  const store = useRocketsStore()

  function loadDetail () {
    const id = Number(route.params.id)
    if (Number.isNaN(id)) {
      store.setDetailError('Invalid rocket id')
      return
    }
    store.loadRocketById(id)
  }

  onMounted(loadDetail)

  watch(() => route.params.id, loadDetail)

  onUnmounted(() => {
    store.clearSelectedRocket()
  })
</script>
