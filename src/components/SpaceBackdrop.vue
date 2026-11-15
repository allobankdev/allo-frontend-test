<template>
  <!-- Decorative, fixed scene behind the app: starfield, Earth's horizon, Mars and a distant ringed planet. -->
  <div
    class="starfield pointer-events-none fixed inset-0 z-0 overflow-hidden"
    aria-hidden="true"
  >
    <!-- Ringed gas giant (far, faint) -->
    <img
      :src="saturnImage"
      alt=""
      width="640"
      height="394"
      class="absolute -left-40 top-[46%] hidden w-80 opacity-60 xl:block 2xl:-left-12"
    >

    <!-- Mars with a small moon -->
    <img
      :src="marsImage"
      alt=""
      width="960"
      height="960"
      class="absolute -right-80 top-24 hidden w-[30rem] xl:block 2xl:-right-36"
    >

    <!-- Earth's horizon seen from orbit (cropped from the bottom-center on narrow screens) -->
    <img
      :src="earthImage"
      alt=""
      width="2880"
      height="840"
      class="absolute inset-x-0 bottom-0 h-[42vh] w-full object-cover object-bottom"
    >
  </div>
</template>

<script setup lang="ts">
  import earthImage from '@/assets/planets/earth.png'
  import marsImage from '@/assets/planets/mars.png'
  import saturnImage from '@/assets/planets/saturn.png'
</script>
