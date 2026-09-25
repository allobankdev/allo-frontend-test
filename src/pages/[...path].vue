<template>
  <v-container>
    <StatusMessage
      heading-tag="h1"
      icon="mdi-map-marker-question-outline"
      message="The page you're looking for doesn't exist."
      title="Page not found"
    >
      <template #actions>
        <v-btn
          color="primary"
          size="large"
          :to="{ name: '/' }"
        >
          Go to rockets
        </v-btn>
      </template>
    </StatusMessage>
  </v-container>
</template>

<script lang="ts" setup>
  import StatusMessage from '@/components/StatusMessage.vue'
</script>
