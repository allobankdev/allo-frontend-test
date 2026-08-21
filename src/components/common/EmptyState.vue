<template>
  <div class="hig-empty-state">
    <v-icon
      :size="64"
      color="tertiary-label"
      class="mb-4"
      aria-hidden="true"
    >
      {{ icon }}
    </v-icon>

    <h2 class="hig-title2 mb-2">{{ title }}</h2>

    <p v-if="subtitle" class="hig-subhead hig-secondary mb-6">
      {{ subtitle }}
    </p>

    <v-btn
      v-if="showClearAction"
      variant="tonal"
      color="primary"
      rounded="pill"
      class="hig-clear-btn"
      @click="$emit('clear')"
    >
      Clear Search
    </v-btn>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title: string
  subtitle?: string
  showClearAction?: boolean
}>(), {
  icon: 'mdi-tray-remove',
  showClearAction: false,
})

defineEmits<{ clear: [] }>()
</script>

<style scoped>
.hig-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--hig-space-3xl) var(--hig-space-xl);
  min-height: 300px;
  font-family: var(--hig-font-stack);
}

.hig-title2 {
  font-size: var(--hig-title2-size);
  font-weight: var(--hig-title2-weight);
  line-height: var(--hig-title2-lh);
  color: var(--hig-label);
  margin: 0;
}

.hig-subhead {
  font-size: var(--hig-subhead-size);
  line-height: var(--hig-subhead-lh);
  margin: 0;
}

.hig-secondary {
  color: var(--hig-secondary-label);
  max-width: 260px;
}

.hig-clear-btn {
  min-height: var(--hig-tap-target) !important;
  font-family: var(--hig-font-stack);
}
</style>
