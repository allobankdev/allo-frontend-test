<template>
  <v-row>
    <v-col
      v-for="item in 6"
      :key="item"
      cols="12"
      sm="6"
      md="4"
    >
      <v-skeleton-loader
        type="image, article"
        class="rounded-lg"
      />
    </v-col>
  </v-row>
</template>