<template>
  <v-card link :to="`/${item.id}`">
    <v-img class="align-end text-white" height="200" :src="item.images?.[0]" cover>
      <template #placeholder>
        <v-img height="200" cover src="/images/placeholder.png" />
      </template>

      <template #error>
        <v-img height="200" cover src="/images/placeholder.png" />
      </template>

      <v-card-title>{{ item.name }}</v-card-title>
    </v-img>

    <v-card-subtitle class="pt-4">
      {{ item.country }}
    </v-card-subtitle>

    <v-card-text>
      <div class="desc">
        {{ item.description }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type {Rocket} from '@/types/Rocket'

defineProps<{item: Rocket}>()
</script>


<style scoped>
.desc {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  overflow: hidden;
  white-space: normal;
  word-break: break-word;
}
</style>
