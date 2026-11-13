<script setup lang="ts">
interface Props {
    message?: string
}

withDefaults(defineProps<Props>(), {
    message: 'No data found'
})
</script>

<template>
  <v-alert
    type="info"
    variant="tonal"
  >
    {{ message }}
  </v-alert>
</template>

