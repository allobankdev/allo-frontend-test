<template>
  <div>
    <p v-if="rocketStore.loading">Loading ....</p>
    <p v-else-if="rocketStore.error">
      Error: {{ rocketStore.error }}
      <button type="button" @click="rocketStore.fetchRockets">Retry</button>
    </p>
    <div v-else>
      <AddRocketDialog />
      <v-text-field v-model="searchKeyword" label="Search Rocket...." />
      <RouterLink v-for="rocket in filteredRockets" :key="rocket.id" :to="`/rockets/${rocket.id}`"
        style="text-decoration: none; color: inherit;">
        <RocketCard :rocket="rocket" />

      </RouterLink>
    </div>

  </div>
</template>

<script lang="ts" setup>
import RocketCard from '@/components/RocketCard.vue';
import AddRocketDialog from '@/components/AddRocketDialog.vue';
import { computed, onMounted, ref } from 'vue';
import { useRocketStore } from '@/stores/rocket';

const rocketStore = useRocketStore();

const searchKeyword = ref('');

const filteredRockets = computed(() =>
  rocketStore.rockets.filter((rocket) =>
    rocket.full_name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
);

onMounted(() => {
  rocketStore.fetchRockets();
});
</script>
