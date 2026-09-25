<template>
  <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <LoadingHandler
      v-if="status === 'loading'"
      :count="1"
      class="!grid-cols-1"
    />

    <ErrorHandler
      v-else-if="status === 'error'"
      :message="errorMessage"
      @retry="loadRocket"
    />

    <DrawerRocketDetail
      v-else-if="rocket"
      :rocket="rocket"
    />
  </div>
</template>

<script lang="ts" setup>
  import ErrorHandler from '@/components/errorComponent/ErrorHandler.vue'
import LoadingHandler from '@/components/errorComponent/LoadingHandler.vue'
import DrawerRocketDetail from '@/components/rocketComponents/DrawerRocketDetail.vue'
import { useRocketDetail } from '@/lib/api/rocketApi'
import { computed, onMounted, watch } from 'vue'

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
