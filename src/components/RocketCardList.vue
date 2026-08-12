<template>
  <div class="ml-4 mr-4">
    <ErrorState v-if="listRocket.error" :message="listRocket.error" @retry="listRocket.fetchRockets" />
    <CardSkeleton v-else-if="listRocket.loading" />
    <EmptyList v-else-if="!listRocket.loading && listRocket.filteredItems.length === 0 && !listRocket.error" />
    <CardList v-else :items="listRocket.filteredItems" />
  </div>
</template>

<script lang="ts" setup>
import {useRocketStore} from '@/stores/useRocketStore'
import {onMounted} from 'vue'
import CardSkeleton from './CardSkeleton.vue'
import EmptyList from './EmptyList.vue'

const listRocket = useRocketStore()

onMounted(() => {
  listRocket.fetchRockets()
})

</script>
