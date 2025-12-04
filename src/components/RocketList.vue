<template>
  <ul v-if="props.isLoading">
    <li v-for="idx in 5" :key="idx">
      <v-skeleton-loader type="paragraph" />
    </li>
  </ul>

  <v-list v-else lines="three" class="cursor-pointer">
    <v-list-item
      v-for="rocket in props.data"
      :key="rocket.id"
      :title="rocket.name"
      :subtitle="rocket.description"
      @click="toRocketDetail(rocket.id)"
    />
  </v-list>
</template>

<script setup lang="ts">
import type { Rocket } from "@/types/rockets";
import { useRouter } from "vue-router";

const router = useRouter();

function toRocketDetail(id: string) {
  router.push(`rocket/${id}`);
}

const props = defineProps<{ data: Rocket[]; isLoading: boolean }>();
</script>
