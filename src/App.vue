<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap");

:root {
  font-family: "Chakra Petch", sans-serif;
  color: #1c293c;
  background: #fbfbf9;
  font-synthesis: none;
}

body {
  margin: 0;
  min-width: 320px;
  background: #fbfbf9;
}

button,
input,
textarea {
  font-family: inherit;
}
</style>
