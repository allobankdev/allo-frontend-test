<template>
  <div class="hero-image-wrapper">
    <v-img
      :src="imageUrl || undefined"
      :alt="altText"
      height="420"
      cover
      class="hero-image"
    >
      <template #placeholder>
        <div class="hero-fallback">
          <v-progress-circular
            indeterminate
            size="36"
            width="3"
            color="white"
          />
        </div>
      </template>
      <template #error>
        <div class="hero-fallback">
          <v-icon
            icon="mdi-rocket-launch-outline"
            size="84"
            color="blue-grey-lighten-2"
          />
        </div>
      </template>
    </v-img>

    <div
      v-if="isCustom"
      class="custom-badge-wrapper"
    >
      <span class="custom-badge">Custom Added Vehicle</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  imageUrl: string | null
  altText: string
  isCustom?: boolean
}>()
</script>

<style scoped>
.hero-image-wrapper {
  position: relative;
  width: 100%;
  height: 420px;
  background: #0f172a;
}

.hero-image {
  width: 100%;
  height: 100%;
}

.hero-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.custom-badge-wrapper {
  position: absolute;
  top: 16px;
  left: 16px;
}

.custom-badge {
  background-color: rgba(59, 130, 246, 0.9);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 6px;
  backdrop-filter: blur(4px);
}

@media (max-width: 600px) {
  .hero-image-wrapper {
    height: 260px;
  }
}
</style>
