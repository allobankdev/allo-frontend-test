<template>
  <v-container class="fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        class="text-center"
      >
        <template v-if="loading">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            width="6"
            class="mb-6"
          />
          <div class="text-h6 text-medium-emphasis">
            {{ loadingText }}
          </div>
        </template>

        <template v-else-if="error">
          <v-icon
            icon="mdi-alert-circle-outline"
            size="64"
            color="error"
            class="mb-4"
          />
          <div class="text-h6 mb-2">
            Something went wrong
          </div>
          <div class="text-body-2 text-medium-emphasis mb-6">
            {{ error }}
          </div>
          <v-btn
            color="primary"
            variant="elevated"
            prepend-icon="mdi-refresh"
            rounded="lg"
            size="large"
            @click="$emit('retry')"
          >
            Retry
          </v-btn>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
defineProps<{
  loading: boolean
  error: string | null
  loadingText?: string
}>()

defineEmits<{
  retry: []
}>()
</script>
