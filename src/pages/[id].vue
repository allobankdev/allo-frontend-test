<template>
  <v-btn
    variant="plain"
    size="small"
    prepend-icon="mdi-arrow-left"
    class="px-0"
    to="/"
  >
    Back to rockets
  </v-btn>

  <div class="d-md-flex align-start ga-6 py-6">
    <div class="flex-1-1-100">
      <v-img
        :aspect-ratio="4 / 5"
        class="bg-surface elevation-3 fill-width fill-height"
        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
        cover
      ></v-img>
    </div>
    <div class="flex-1-1-100 d-flex flex-column ga-4">
      <div>
        <h1>Falcon 9</h1>
        <p>
          A two-stage rocket designed and manufactured by SpaceX. It is the
          first orbital class rocket capable of reflight.
        </p>
      </div>
      <v-row align="center">
        <v-col cols="12" sm="12" md="6">
          <v-card>
            <v-card-item>
              <v-card-subtitle>country</v-card-subtitle>
            </v-card-item>
            <v-card-text>USA</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-card>
            <v-card-item>
              <v-card-subtitle>first flight</v-card-subtitle>
            </v-card-item>
            <v-card-text>70 m</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-item>
              <v-card-subtitle>cost per lauch</v-card-subtitle>
            </v-card-item>
            <v-card-text>$900000</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
