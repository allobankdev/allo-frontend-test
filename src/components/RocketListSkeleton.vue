<template>
  <v-row
    aria-label="Loading rockets"
    class="rocket-grid"
  >
    <v-col
      v-for="index in 6"
      :key="index"
      cols="12"
      lg="4"
      sm="6"
    >
      <v-card
        class="rocket-card rocket-card--skeleton"
        variant="flat"
      >
        <v-skeleton-loader type="image, article" />
      </v-card>
    </v-col>
  </v-row>
</template>
