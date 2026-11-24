<template>
  <v-alert
    border="start"
    class="my-6 pa-6 rounded-lg"
    icon="false"
    type="error"
    variant="tonal"
  >
    <div class="d-flex flex-column align-center text-center py-2">
      <v-icon
        class="mb-3"
        color="error"
        icon="mdi-alert-circle-outline"
        size="56"
      />
      <p class="text-body-1 font-weight-medium mb-4">
        {{ message }}
      </p>
      <v-btn
        v-if="retryable"
        color="error"
        prepend-icon="mdi-refresh"
        variant="outlined"
        @click="emit('retry')"
      >
        Try again
      </v-btn>
    </div>
  </v-alert>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    message: string
    retryable?: boolean
  }>(),
  {
    retryable: true,
  },
)

const emit = defineEmits<{
  retry: []
}>()
</script>
