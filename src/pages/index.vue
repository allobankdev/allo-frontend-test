<template>
  <VContainer>
    <div class="d-flex justify-space-between align-center">
      <div>
        <h1>All Rockets</h1>
        <p></p>
      </div>
      <div>
        <v-btn color="primary" prepend-icon="mdi-plus"> Add Rocket </v-btn>
      </div>
    </div>

    <div class="py-6">
      <v-text-field
        placeholder="Search rockets by name..."
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>

      <v-row align="stretch">
        <v-col
          v-for="rocket in rockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card :to="`/${rocket.id}`" height="100%">
            <v-img
              :aspect-ratio="4 / 5"
              class="bg-surface elevation-3 fill-width"
              src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
              cover
            ></v-img>
            <v-card-item>
              <v-card-title>{{ rocket.name }}</v-card-title>
            </v-card-item>
            <v-card-text>{{ rocket.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </VContainer>
</template>

<script lang="ts" setup>
const rockets = [
  {
    id: 1,
    name: "Falcon 9",
    description: "A two-stage rocket designed and manufactured by SpaceX.",
  },
  {
    id: 2,
    name: "Atlas V",
    description:
      "An expendable launch system developed by Lockheed Martin and operated by United Launch Alliance.",
  },
  {
    id: 3,
    name: "Delta IV Heavy",
    description:
      "A heavy-lift launch vehicle developed by Boeing and operated by United Launch Alliance.",
  },
];
</script>
