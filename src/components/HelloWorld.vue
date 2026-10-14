<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="900"
    >
      <v-img
        class="mb-4"
        height="150"
        src="@/assets/logo.png"
      />

      <div class="text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>

        <h1 class="text-h2 font-weight-bold">Vuetify</h1>
      </div>

      <div class="py-4" />

<div class="py-4 text-center">
  <v-btn
    color="primary"
    size="large"
    prepend-icon="mdi-rocket-launch"
    to="/launchers"
    rounded="lg"
  >
    Go to Rocket List
  </v-btn>
</div>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
  //
</script>
