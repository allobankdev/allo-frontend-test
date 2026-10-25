<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
</script>

<style>
@font-face {
  font-family: 'Helmet';
  src: url('/helmet-1.0/Helmet-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

body,
#app,
.v-application,
.v-application [class*="text-"],
.v-btn,
.v-card,
.v-field,
.v-input {
  font-family: 'Helmet', sans-serif !important;
}

.v-icon.mdi,
.mdi {
  font-family: 'Material Design Icons' !important;
}

.v-main {
  background: #0a0a0a;
  min-height: 100vh;
}
</style>
