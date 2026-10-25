<template>
  <v-row>
    <v-col
      v-for="n in 6"
      :key="n"
      cols="12"
      sm="6"
      md="4"
    >
      <v-skeleton-loader
        type="card"
        elevation="2"
        rounded="lg"
      />
    </v-col>
  </v-row>
</template>
