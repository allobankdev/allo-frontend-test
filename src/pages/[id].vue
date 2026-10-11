<template>
  <div class="pa-4">
    <ErrorState v-if="rocketStore.error" :message="rocketStore.error"
      @retry="rocketStore.fetchRocketDetail(rocketId)" />
    <CardSkeleton v-else-if="rocketStore.loading" md="12" amount="1" />
    <CardDetailItem v-else :item="detail" />
  </div>
</template>

<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {useRocketStore} from '@/stores/useRocketStore'
import {computed, onMounted} from 'vue'

const route = useRoute()
const rocketStore = useRocketStore()
const detail = computed(() => rocketStore.detail)
const rocket = computed(() =>
  [...rocketStore.itemsCreated, ...rocketStore.items].find(i => i.id === route.params.id)
)

const rocketId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? id[0] : id
})

onMounted(() => {
  if (!rocketId.value) return

  if (rocketId.value) {
    if (rocket.value) {
      rocketStore.setDetail(rocket.value)
    } else {
      rocketStore.fetchRocketDetail(rocketId.value)
    }
  }
})

</script>
