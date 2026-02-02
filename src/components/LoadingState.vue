<!-- components/LoadingState.vue -->
<template>
  <div class="loading-state">
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            :size="size"
            :width="width"
            color="primary"
            indeterminate
          ></v-progress-circular>

          <div v-if="message" class="mt-4 text-h6 text-grey">
            {{ message }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
  size?: number;
  width?: number;
}

withDefaults(defineProps<Props>(), {
  message: "Loading...",
  size: 70,
  width: 7,
});
</script>

<style scoped>
.loading-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
