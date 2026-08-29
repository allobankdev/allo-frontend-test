<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="text-none font-weight-regular"
          text="Add Rocket"
          variant="tonal"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <v-card prepend-icon="mdi-account" title="User Profile">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                label="Rocket name*"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.description"
                label="Description"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.country"
                label="Description"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-number-input
                v-model="form.cost_per_launch"
                label="Cost"
                control-variant="hidden"
              ></v-number-input>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

          <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            @click="addRocket"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, ref } from "vue";
import { useRocketsStore } from "@/stores/rocketStore.ts";
const form = ref({
  name: "",
  description: "",
  cost_per_launch: 0,
  country: "",
});
const rocketsStore = useRocketsStore();

const addRocket = () => {
  rocketsStore.handleAddRocket({
    name: form.value.name,
    description: form.value.description,
    id: "5e9d0d95eda69955f709d1eb",
    flickr_images: ["https://imgur.com/DaCfMsj.jpg"],
    first_flight: "2006-03-24",
    cost_per_launch: form.value.cost_per_launch,
    country: form.value.country,
  });
  dialog.value = false;
  form.value = {
    name: "",
    description: "",
    cost_per_launch: 0,
    country: "",
  };
};

const dialog = shallowRef(false);
</script>
