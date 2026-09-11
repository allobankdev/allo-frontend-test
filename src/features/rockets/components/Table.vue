<template>
  <v-table>
    <thead>
      <tr>
        <th>No</th>
        <th>Name</th>
        <th>Image</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="isLoading">
        <td colspan="4" class="text-center">Loading...</td>
      </tr>
      <tr v-else-if="error">
        <td colspan="4" class="text-center">
          <p class="my-2">
            Error:
            {{ error?.message || error || "An unknown error occurred" }}
          </p>
          <v-btn size="small" variant="tonal" @click="refetch" class="mb-3">
            Retry
          </v-btn>
        </td>
      </tr>
      <template v-else-if="rockets && rockets.length > 0">
        <tr
          class="row cursor-pointer"
          v-for="(item, index) in rockets"
          :key="index"
          @click="$router.push(`/rockets/${item.id}`)"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ item.full_name }}</td>
          <td>
            <v-avatar v-if="item.image_url" :image="item.image_url"></v-avatar>
            <v-avatar v-else color="surface-variant"></v-avatar>
          </td>
          <td :class="['desc', item?.description ? '' : 'text-disabled']">
            {{ item?.description || "No description" }}
          </td>
        </tr>
      </template>
      <tr v-else>
        <td colspan="4" class="text-center">No data available</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
import type { RocketData } from "@/types";

defineProps<{
  rockets: RocketData[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}>();
</script>

<style scoped>
.row:hover {
  background-color: rgba(238, 238, 238, 0.055);
}
</style>
