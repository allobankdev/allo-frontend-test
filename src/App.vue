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
* {
  caret-color: transparent;
}

input,
textarea,
[contenteditable="true"] {
  caret-color: auto;
}
</style>
