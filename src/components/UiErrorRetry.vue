<template>
  <v-alert
    type="error"
    variant="tonal"
    rounded="lg"
    class="my-6"
  >
    <div class="d-flex flex-column ga-3">
      <div>
        <div class="text-subtitle-1 font-weight-bold">Failed to load data</div>
        <div class="text-body-2">{{ message }}</div>
      </div>

      <div>
        <v-btn color="error" variant="flat" @click="$emit('retry')">
          Retry
        </v-btn>
      </div>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{ message: string }>()
defineEmits<{ retry: [] }>()
</script>