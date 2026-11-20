<template>
  <v-sheet
    rounded="xl"
    class="empty-state pa-10 text-center bg-surface"
  >
    <div class="empty-icon-badge d-inline-flex align-center justify-center mb-4">
      <v-icon
        :icon="icon"
        size="28"
        color="primary"
      />
    </div>

    <component
      :is="headingTag"
      class="text-h6 font-weight-bold mb-1"
    >
      {{ title }}
    </component>

    <p class="text-body-2 text-medium-emphasis mb-5 mx-auto empty-description">
      {{ description }}
    </p>

    <v-btn
      v-if="actionLabel"
      :to="actionTo"
      color="primary"
      variant="flat"
      rounded="lg"
      class="text-none"
      @click="handleAction"
    >
      {{ actionLabel }}
    </v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    description: string
    icon?: string
    actionLabel?: string
    actionTo?: string
    headingTag?: 'h1' | 'h2'
  }>(),
  {
    icon: 'mdi-rocket-outline',
    actionLabel: undefined,
    actionTo: undefined,
    headingTag: 'h2',
  },
)

const emit = defineEmits<{
  action: []
}>()

function handleAction () {
  if (!props.actionTo) {
    emit('action')
  }
}
</script>

<style scoped>
.empty-state {
  border: 1px solid var(--app-border);
}

.empty-icon-badge {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.22);
}

.empty-description {
  max-width: 380px;
}
</style>
