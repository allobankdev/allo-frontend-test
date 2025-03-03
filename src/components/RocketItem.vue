<template>
    <div class="rocket-item" @click="goToDetail">
      <img :src="rocket.flickr_images[0]" alt="Rocket Image" />
      <h2>{{ rocket.name }}</h2>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  defineProps(['rocket']);
  const router = useRouter();
  
  const goToDetail = () => {
    router.push(`/rocket/${rocket.id}`);
  };
  </script>
  
  <style scoped>
  .rocket-item {
    border: 1px solid #ddd;
    padding: 10px;
    cursor: pointer;
  }
  .rocket-item img {
    width: 100%;
    height: auto;
  }
  </style>
  