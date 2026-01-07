<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  message?: string
  title?: string
  type?: 'network' | 'server' | 'notfound' | 'generic'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'generic'
})

const emit = defineEmits<{
  retry: []
}>()

// Error content based on type
const errorContent = computed(() => {
  const contents = {
    network: {
      icon: 'mdi-wifi-off',
      title: 'Connection Problem',
      subtitle: "We couldn't connect to our servers",
      description: 'Please check your internet connection and try again.',
      suggestions: [
        'Check if you are connected to the internet',
        'Try refreshing the page',
        'Wait a moment and try again'
      ]
    },
    server: {
      icon: 'mdi-server-off',
      title: 'Server Unavailable',
      subtitle: 'Our servers are taking a break',
      description: "We're having trouble reaching our servers right now. This is usually temporary.",
      suggestions: [
        'Wait a few moments and try again',
        'The issue is on our end, not yours',
        'Our team is likely already working on it'
      ]
    },
    notfound: {
      icon: 'mdi-rocket-launch-outline',
      title: 'Data Not Found',
      subtitle: "We couldn't find what you're looking for",
      description: 'The rocket data you requested may have been moved or is no longer available.',
      suggestions: [
        'Go back to the main page',
        'Try searching for a different rocket',
        'The data might be temporarily unavailable'
      ]
    },
    generic: {
      icon: 'mdi-alert-circle-outline',
      title: 'Something Went Wrong',
      subtitle: "We couldn't load the data",
      description: "Don't worry, this happens sometimes. Let's try to fix it together.",
      suggestions: [
        'Try refreshing the page',
        'Check your internet connection',
        'Come back in a few minutes'
      ]
    }
  }

  return contents[props.type] || contents.generic
})

// Override title if provided via props
const displayTitle = computed(() => props.title || errorContent.value.title)

function handleRetry() {
  emit('retry')
}
</script>

<template>
  <v-container class="error-state">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6" class="text-center">
        <v-card variant="flat" class="pa-6 pa-md-8 error-card">
          <!-- Icon -->
          <div class="error-icon-wrapper mb-4">
            <v-icon :icon="errorContent.icon" size="72" color="error" />
          </div>

          <!-- Title -->
          <h2 class="text-h5 text-md-h4 font-weight-bold mb-2">
            {{ displayTitle }}
          </h2>

          <!-- Subtitle -->
          <p class="text-subtitle-1 text-medium-emphasis mb-4">
            {{ errorContent.subtitle }}
          </p>

          <!-- Description -->
          <p class="text-body-2 text-medium-emphasis mb-6">
            {{ message || errorContent.description }}
          </p>

          <!-- Suggestions -->
          <v-card variant="tonal" color="grey" class="pa-4 mb-6 text-left">
            <p class="text-caption font-weight-medium text-medium-emphasis mb-2">
              What you can try:
            </p>
            <ul class="suggestions-list">
              <li v-for="(suggestion, index) in errorContent.suggestions" :key="index"
                class="text-body-2 text-medium-emphasis">
                {{ suggestion }}
              </li>
            </ul>
          </v-card>

          <!-- Action Buttons -->
          <div class="d-flex flex-column flex-sm-row justify-center gap-3">
            <v-btn color="primary" size="large" min-width="160" @click="handleRetry">
              <v-icon icon="mdi-refresh" start />
              Try Again
            </v-btn>
            <v-btn variant="outlined" size="large" min-width="160" href="/">
              <v-icon icon="mdi-home" start />
              Back to Home
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.error-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-card {
  background: transparent;
}

.error-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(var(--v-theme-error), 0.1);
}

.suggestions-list {
  margin: 0;
  padding-left: 20px;
}

.suggestions-list li {
  margin-bottom: 4px;
}

.suggestions-list li:last-child {
  margin-bottom: 0;
}
</style>
