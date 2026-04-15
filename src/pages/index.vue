<template>
  <div class="max-w-5xl mx-auto">
    <div class="flex justify-between my-10">
      <form class="flex justify-center gap-2" @submit.prevent="handleSearch">
        <v-text-field v-model="searchQuery" hide-details="auto" :size="'large'" label="Searh rocket"></v-text-field>
        <v-btn class="px-2" type="submit" :variant="'outlined'" :size="'xx-large'">
          Search
        </v-btn>
      </form>
      <AddRocketDialog />
    </div>
    <ListsRocket
      :rockets="rocketStore.filteredRockets"
      :loading="rocketStore.loading"
      :error="rocketStore.error"
      :on-retry="() => rocketStore.getRocketLists()"
    />
  </div>
</template>

<script lang="ts" setup>
import AddRocketDialog from '@/components/AddRocketDialog.vue';
import { useRocketStore } from '@/stores/store'
import { onMounted, ref } from 'vue';
//
const searchQuery = ref('')
const rocketStore = useRocketStore()

onMounted(() => rocketStore.getRocketLists())

const handleSearch = async () => {
  rocketStore.loading = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))
    rocketStore.searchQuery = searchQuery.value.trim()
  } finally {
    rocketStore.loading = false
  }
}

</script>
