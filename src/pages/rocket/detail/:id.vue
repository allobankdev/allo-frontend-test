<template>
  <v-container>
    <v-btn class="bg-blue mb-4" :to="`/rocket/list`" rounded>
      <v-icon icon="mdi-arrow-left"></v-icon> &nbsp; Back
    </v-btn>

    <v-card flat>
      <v-divider></v-divider>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-rocket"></v-icon> &nbsp; {{rocket.name}}
      </v-card-title>

      <v-divider></v-divider>

      <v-carousel cycle>
        <v-carousel-item v-for="(item, i) in rocket.flickr_images" :key="i">
          <v-img :src="item" aspect-ratio="1.7" class="white--text align-end">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-skeleton-loader
                  type="image"
                  width="100%"
                  height="100%"
                ></v-skeleton-loader>
              </v-row>
            </template>

          </v-img>
        </v-carousel-item>
      </v-carousel>

      <v-card-text>
        <p>
          <b>{{ rocket.name }} - </b> {{ rocket.description }}
        </p>
        <br>
        <p>
          <strong>First Flight:</strong> {{ rocket.first_flight }}<br />
          <strong>Country:</strong> {{ rocket.country }}<br />
          <strong>Cost Per Launch:</strong>
          {{
            rocket.cost_per_launch.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })
          }}<br />
          <template v-if="rocket.success_rate_pct !== undefined">
            <strong>Success Rate:</strong> {{ rocket.success_rate_pct }}% 
          </template>
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { rocketStore } from "@/stores/rockets.js";

const route = useRoute();
const rocket = ref(rocketStore().getRocket(route.params.id));

onMounted(() => {
  if (!rocket.value) {
    alert("Rocket not found, redirecting to rocket list.");
    router.push("/");
  }
});
</script>
