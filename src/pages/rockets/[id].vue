<template>
  <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <LoadingState
      v-if="status === 'loading'"
      :count="1"
      class="!grid-cols-1"
    />

    <ErrorState
      v-else-if="status === 'error'"
      :message="errorMessage"
      @retry="loadRocket"
    />

    <RocketDetailView
      v-else-if="rocket"
      :rocket="rocket"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, watch } from 'vue'
  import RocketDetailView from '@/components/rockets/RocketDetailView.vue'
  import LoadingState from '@/components/ui/LoadingState.vue'
  import ErrorState from '@/components/ui/ErrorState.vue'
  import { useRocketDetail } from '@/composables/useRocketDetail'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const rocketId = computed(() => Number(router.currentRoute.value.params.id))
  const { rocket, status, errorMessage, fetchRocket } = useRocketDetail()

  function loadRocket () {
    fetchRocket(rocketId.value)
  }

  onMounted(loadRocket)
  watch(rocketId, loadRocket)
</script>
