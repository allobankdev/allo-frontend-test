<template>
  <div class="container border-s border-e">
    <HeaderRocket />

    <div class="pa-5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
  position: relative;
  margin: 0 auto;
  min-height: 100vh;
  max-width: 900px;
}
</style>
