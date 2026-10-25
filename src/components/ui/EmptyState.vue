<template>
  <div class="empty-wrapper">
    <div class="empty-icon-wrap mb-4">
      <v-icon color="primary" size="52" style="opacity:0.5">mdi-rocket-launch-outline</v-icon>
    </div>
    <h3 class="text-h6 font-weight-semibold text-white mb-2">{{ title }}</h3>
    <p class="text-body-2 text-medium-emphasis mb-4">{{ subtitle }}</p>
    <slot />
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{ title?: string; subtitle?: string }>(),
  {
    title: 'Tidak Ada Roket',
    subtitle: 'Coba ubah filter pencarian.',
  },
)
</script>

<style scoped>
.empty-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.empty-icon-wrap {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(79, 142, 247, 0.06);
  border: 1px dashed rgba(79, 142, 247, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
