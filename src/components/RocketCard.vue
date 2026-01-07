<template>
  <div class="rocket-card" @click="$router.push(`/rocket/${rocket.id}`)">
    <img :src="rocket.flickr_images[0]" alt="rocket.name" />
    <h3>{{ rocket.name }}</h3>
    <p>{{ rocket.description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  rocket: Object,
});
</script>
