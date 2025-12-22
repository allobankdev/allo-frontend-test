<template>
  <v-container>
    <v-row justify="center">
      <h2 class="pt-5">Welcome to Rocket Showcase</h2>
    </v-row>
    <v-row justify="center">
      <v-btn class="align-center mt-5" to="/rocket/list">
        Click here to explore rockets!
      </v-btn>
    </v-row>
    <v-row justify="center">
      <img
        class="align-center"
        src="/src/assets/home_rocket.jpg"
        alt="Rocket woosh"
        style="max-width: 600px; width: 100%; margin-top: 20px"
      />
    </v-row>
  </v-container>

  <!-- <HelloWorld /> -->
</template>

<script lang="ts" setup>
//
</script>
