<template>
  <v-container class="py-12">
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
        lg="6"
      >
        <v-card
          class="text-center pa-6 rounded-xl border"
          elevation="3"
        >
          <v-avatar
            class="mb-4"
            color="error-lighten-5"
            size="72"
          >
            <v-icon
              color="error"
              icon="mdi-alert-circle-outline"
              size="40"
            />
          </v-avatar>

          <h2 class="text-h5 font-weight-bold mb-2">
            {{ title }}
          </h2>

          <p class="text-body-1 text-medium-emphasis mb-6">
            {{ message || 'Failed to communicate with Launch Library API. Please check your internet or rate limit and try again.' }}
          </p>

          <div class="d-flex justify-center ga-3">
            <v-btn
              color="primary"
              prepend-icon="mdi-refresh"
              size="large"
              variant="flat"
              @click="$emit('retry')"
            >
              Retry Request
            </v-btn>
            <slot name="extra-actions" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message?: string | null
  }>(),
  {
    title: 'Unable to Load Rockets',
    message: null,
  }
)

defineEmits<{
  (e: 'retry'): void
}>()
</script>
