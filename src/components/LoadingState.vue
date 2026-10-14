
<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'Loading...',
  },
)
</script>

<template>
  <v-card
    class="state-box"
    variant="outlined"
    rounded="lg"
    role="status"
    aria-live="polite"
  >
    <v-card-text class="pa-8 pa-md-12 text-center">
      <v-progress-circular
        class="loading-spinner mb-5"
        indeterminate
        color="blue-lighten-2"
        :size="36"
        :width="3"
        aria-hidden="true"
      />

      <p class="loading-message mb-0">
        {{ message }}
      </p>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.state-box {
  background: #111621;
  border-color: #252d3c;
}

.loading-spinner {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.loading-message {
  color: #a1aabd;
  font-size: 14px;
  line-height: 1.7;
}
</style>
