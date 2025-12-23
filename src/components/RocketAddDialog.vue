<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ props }">
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        v-bind="props"
        class="ml-2"
        elevation="2"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="text-h5">New Rocket</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="rocket.name"
                  label="Rocket Name*"
                  required
                  :rules="[(v) => !!v || 'Name is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="rocket.country"
                  label="Country*"
                  required
                  :rules="[(v) => !!v || 'Country is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="rocket.cost_per_launch"
                  label="Cost per Launch ($)"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="rocket.flickr_images[0]"
                  label="Image URL"
                  hint="Public URL for rocket image"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="rocket.description"
                  label="Description"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
          <small class="text-caption text-medium-emphasis"
            >*indicates required field</small
          >
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
          Close
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="save"
          :disabled="!valid"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRocketStore } from "@/stores/rocket";
import type { Rocket } from "@/stores/rocket";

const dialog = ref(false);
const valid = ref(false);
const store = useRocketStore();

const rocket = reactive({
  name: "",
  country: "",
  cost_per_launch: 0,
  description: "",
  flickr_images: [""] as string[],
  id: "",
  active: true,
  company: "SpaceX",
  first_flight: new Date().toISOString().split("T")[0],
  height: { meters: 0, feet: 0 },
  mass: { kg: 0, lb: 0 },
});

const save = () => {
  if (!valid.value) return;

  const newRocket: Rocket = {
    ...rocket,
    id: Date.now().toString(), // Simple ID generation
    flickr_images: rocket.flickr_images[0] ? [rocket.flickr_images[0]] : [],
  };

  store.addRocket(newRocket);
  dialog.value = false;
  resetForm();
};

const resetForm = () => {
  rocket.name = "";
  rocket.country = "";
  rocket.cost_per_launch = 0;
  rocket.description = "";
  rocket.flickr_images = [""];
};
</script>
