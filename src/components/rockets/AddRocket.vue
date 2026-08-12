<template>
  <div>
    <!-- Trigger Button -->
    <v-btn
      block
      color="primary"
      @click="dialog = true"
      :disabled="loading"
      :loading="loading"
    >
      Add Rocket
    </v-btn>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Add New Rocket</v-card-title>

        <v-card-text>
          <v-form ref="formRef" v-model="valid">
            <div>
              <small>
                use this image for testing: https://picsum.photos/400/300
              </small>
              <!-- Rocket Image -->
              <v-text-field
                v-model="form.image"
                label="Rocket Image URL"
                placeholder="https://example.com/rocket.jpg"
                prepend-inner-icon="mdi-image"
                :rules="[required]"
              />
            </div>

            <!-- Rocket Name -->
            <v-text-field
              v-model="form.name"
              label="Rocket Name"
              prepend-inner-icon="mdi-rocket"
              :rules="[required]"
              class="mt-3"
            />

            <!-- Description -->
            <v-textarea
              v-model="form.description"
              label="Description"
              rows="3"
              auto-grow
              :rules="[required]"
              class="mt-3"
            />

            <!-- Cost Per Launch -->
            <v-text-field
              v-model="form.cost_per_launch"
              label="Cost per Launch (USD)"
              type="number"
              prepend-inner-icon="mdi-currency-usd"
              :rules="[required]"
              class="mt-3"
            />

            <!-- Country -->
            <v-text-field
              v-model="form.country"
              label="Country"
              prepend-inner-icon="mdi-earth"
              :rules="[required]"
              class="mt-3"
            />

            <!-- First Flight -->
            <v-text-field
              v-model="form.first_flight"
              label="First Flight"
              type="date"
              prepend-inner-icon="mdi-calendar"
              :rules="[required]"
              class="mt-3"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="onClose">Cancel</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="onSubmit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
// NOTE:
// Add Rocket is stored in local state only.
// r-spacex API is read-only and does not support creating rockets.

import { ref } from "vue";
import { storeToRefs } from "pinia";

import { useRocketStore } from "@/stores/rocketStore";

const rocketStore = useRocketStore();
const { loading } = storeToRefs(rocketStore);

const dialog = ref(false);
const valid = ref(false);
const formRef = ref();

const form = ref({
  image: "https://picsum.photos/400/300",
  name: "",
  description: "",
  cost_per_launch: "",
  country: "",
  first_flight: "",
});

const required = (v: string) => !!v || "This field is required";

const onClose = () => {
  dialog.value = false;
  formRef.value?.reset();
};

const onSubmit = () => {
  if (!formRef.value?.validate()) return;

  const payload = {
    id: Date.now().toString(),
    name: form.value.name,
    description: form.value.description,
    cost_per_launch: Number(form.value.cost_per_launch),
    country: form.value.country,
    first_flight: form.value.first_flight,
    flickr_images: [form.value.image],
    active: true,

    mockup: true, // for dummy data
  };

  rocketStore.addRocket(payload);

  onClose();
};
</script>
