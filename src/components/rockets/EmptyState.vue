<template>
  <v-card
    border
    class="empty-state pa-8 pa-md-12 text-center"
    color="#0f172a"
    rounded="xl"
    variant="flat"
  >
    <v-avatar
      class="mb-4"
      color="primary"
      size="64"
      variant="tonal"
    >
      <v-icon
        :icon="icon"
        size="32"
      />
    </v-avatar>

    <h2 class="text-h6 font-weight-bold text-white mb-2">
      {{ title }}
    </h2>

    <p
      class="text-body-2 text-medium-emphasis mx-auto mb-0"
      style="max-width: 440px;"
    >
      {{ description }}
    </p>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'mdi-rocket-off-outline',
})
</script>

<style scoped>
.empty-state {
  border-color: rgba(148, 163, 184, 0.16) !important;
}
</style>
