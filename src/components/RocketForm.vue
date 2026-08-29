<template>
  <!-- BUTTON -->
  <v-btn color="primary" @click="dialog = true"> Add Rocket </v-btn>

  <!-- DIALOG -->
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>Add New Rocket</v-card-title>

      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model="form.name"
            label="Rocket Name"
            :rules="[rules.required]"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            :rules="[rules.required]"
          />

          <v-text-field v-model="form.image" label="Image URL" />

          <v-text-field
            v-model="form.cost"
            label="Cost per Launch"
            type="number"
          />

          <v-text-field v-model="form.country" label="Country" />

          <v-text-field
            v-model="form.firstFlight"
            label="First Flight (YYYY-MM-DD)"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn text @click="dialog = false"> Cancel </v-btn>

        <v-btn color="primary" @click="submit"> Submit </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRocketStore } from "@/store/rocket.store";
import type { Rocket } from "@/types/rocket";

const store = useRocketStore();

const dialog = ref(false);
const valid = ref(false);

const form = ref({
  name: "",
  description: "",
  image: "",
  cost: 0,
  country: "",
  firstFlight: "",
});

const rules = {
  required: (v: string) => !!v || "Field is required",
};

const submit = () => {
  if (!valid.value) return;

  const DEFAULT_IMAGE = `https://placehold.co/600x400?text=${form.value.name}`;

  const newRocket: Rocket = {
    id: Date.now().toString(),
    name: form.value.name,
    description: form.value.description,
    flickr_images: [form.value.image || DEFAULT_IMAGE],
    cost_per_launch: Number(form.value.cost),
    country: form.value.country,
    first_flight: form.value.firstFlight,
  };

  store.addRocket(newRocket);

  // reset form
  form.value = {
    name: "",
    description: "",
    image: "",
    cost: 0,
    country: "",
    firstFlight: "",
  };

  dialog.value = false;
};
</script>
