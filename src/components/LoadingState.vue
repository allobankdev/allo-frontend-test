<template>
  <div class="py-12">
    <v-row>
      <v-col
        v-for="index in 6"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <v-skeleton-loader
          type="image, heading, paragraph"
        />
      </v-col>
    </v-row>
  </div>
</template>