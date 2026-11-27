<template>
  <v-card
    class="mx-auto my-8 pa-6 rounded-xl border border-red-darken-4 bg-allo-card"
    max-width="600"
    elevation="4"
  >
    <div class="text-center">
      <v-avatar
        color="red-darken-4"
        size="64"
        class="mb-4"
      >
        <v-icon
          icon="mdi-alert-circle-outline"
          size="36"
          color="white"
        />
      </v-avatar>

      <h2 class="text-h5 font-weight-bold text-red-lighten-1 mb-2">
        {{ title }}
      </h2>

      <p class="text-body-1 text-grey-lighten-1 mb-6">
        {{ message || 'An unexpected error occurred while fetching rocket data.' }}
      </p>

      <div class="d-flex justify-center ga-3">
        <v-btn
          color="#ffbc25"
          variant="elevated"
          prepend-icon="mdi-refresh"
          size="large"
          class="font-weight-bold text-black rounded-lg px-6"
          @click="$emit('retry')"
        >
          Try Again
        </v-btn>

        <slot name="extra-actions" />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    message?: string | null
  }>(),
  {
    title: 'Failed to Load Data',
    message: null,
  }
)

defineEmits<{
  (e: 'retry'): void
}>()
</script>

<style scoped>
.bg-allo-card {
  background-color: #131c2e !important;
}
</style>
