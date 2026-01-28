<template>
  <div
    v-if="images && images.length > 1"
    class="gallery-section"
  >
    <h2>Gallery</h2>
    <div class="gallery">
      <img
        v-for="(image, index) in images"
        :key="index"
        :src="image"
        :alt="`Image ${index + 1}`"
        class="gallery-image"
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  images?: string[]
}

defineProps<Props>()
</script>

<style scoped>
.gallery-section {
  margin-top: 32px;
}

.gallery-section h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-image:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .gallery {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
