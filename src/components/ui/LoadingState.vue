<template>
  <v-container
    class="d-flex align-center justify-center"
    style="min-height: 70vh"
  >
    <v-card
      elevation="2"
      rounded="xl"
      class="pa-8 text-center"
      max-width="320"
    >
      <v-progress-circular
        indeterminate
        size="56"
        width="5"
        color="primary"
      />

      <h3 class="text-h6 mt-6">Loading...</h3>

      <p class="text-medium-emphasis mt-2">
        Please wait while we fetch the data.
      </p>
    </v-card>
  </v-container>
</template>
