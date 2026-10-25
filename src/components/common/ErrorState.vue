<template>
  <v-container class="py-12">
    <v-row justify="center">
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="5"
      >
        <v-alert
          border="start"
          icon="mdi-alert-circle-outline"
          type="error"
          variant="tonal"
        >
          <v-alert-title>{{ title }}</v-alert-title>
          <div class="mt-1 text-body-2">
            {{ message }}
          </div>

          <div class="mt-4 d-flex ga-2">
            <v-btn
              color="error"
              prepend-icon="mdi-refresh"
              variant="flat"
              @click="emit('retry')"
            >
              {{ retryLabel }}
            </v-btn>
            <v-btn
              v-if="showBack"
              variant="text"
              @click="emit('back')"
            >
              Back to rocket list
            </v-btn>
          </div>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    title?: string
    message: string
    retryLabel?: string
    showBack?: boolean
  }>(), {
    title: 'Something went wrong',
    retryLabel: 'Retry',
    showBack: false,
  })

  const emit = defineEmits<{
    retry: []
    back: []
  }>()
</script>
