<template>
  <div
    class="rocket-artwork"
    aria-hidden="true"
  >
    <div class="artwork-planet" />
    <div class="artwork-orbit" />
    <div class="artwork-moon" />
    <img
      :src="rocketIllustration"
      alt=""
    >
  </div>
</template>

<script setup lang="ts">
import rocketIllustration from '@/assets/hero-rocket.svg'
</script>
