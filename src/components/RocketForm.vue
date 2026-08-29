<template>
  <v-card>
    <v-card-title class="text-h5">Add New Rocket</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitForm" ref="form">
        <v-text-field
          v-model="formData.rocket_name"
          label="Rocket Name *"
          :rules="[requiredRule]"
          required
          class="mb-3"
        ></v-text-field>

        <v-textarea
          v-model="formData.description"
          label="Description *"
          :rules="[requiredRule]"
          required
          rows="3"
          class="mb-3"
        ></v-textarea>

        <v-text-field
          v-model="formData.image_url"
          label="Image URL"
          placeholder="https://example.com/rocket.jpg"
          class="mb-3"
        ></v-text-field>

        <v-text-field
          v-model="formData.country"
          label="Country *"
          :rules="[requiredRule]"
          required
          class="mb-3"
        ></v-text-field>

        <v-text-field
          v-model="formData.company"
          label="Company *"
          :rules="[requiredRule]"
          required
          class="mb-3"
        ></v-text-field>

        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model.number="formData.cost_per_launch"
              label="Cost per Launch ($) *"
              type="number"
              :rules="[requiredRule, positiveNumberRule]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="formData.first_flight"
              label="First Flight *"
              type="date"
              :rules="[requiredRule]"
              required
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="formData.rocket_type"
              label="Rocket Type *"
              :rules="[requiredRule]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model.number="formData.success_rate_pct"
              label="Success Rate (%)"
              type="number"
              :rules="[percentageRule]"
              min="0"
              max="100"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-checkbox
          v-model="formData.active"
          label="Active Rocket"
          class="mt-3"
        ></v-checkbox>

        <div v-if="errorMessage" class="text-error mb-3">
          {{ errorMessage }}
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey" @click="cancel">Cancel</v-btn>
      <v-btn color="primary" @click="submitForm">Add Rocket</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { CreateRocketDto } from "../types/rocket";

const emit = defineEmits<{
  submit: [rocketData: CreateRocketDto];
  cancel: [];
}>();

const form = ref();
const errorMessage = ref("");

// INITIALIZE DENGAN SEMUA PROPERTIES YANG DIBUTUHKAN
const formData = ref<CreateRocketDto>({
  rocket_name: "",
  description: "",
  image_url: "", // image_url untuk form input
  country: "",
  company: "SpaceX",
  cost_per_launch: 0,
  first_flight: new Date().toISOString().split("T")[0],
  rocket_type: "rocket",
  active: true,
  success_rate_pct: 100,
  wikipedia: "",
  flickr_images: [], // akan diisi dari image_url
});

// Validation rules
const requiredRule = (value: any) => {
  return !!value || "This field is required";
};

const positiveNumberRule = (value: number) => {
  return value > 0 || "Must be a positive number";
};

const percentageRule = (value: number) => {
  if (value === undefined || value === null || value === 0) return true;
  return (value >= 0 && value <= 100) || "Must be between 0 and 100";
};

const cancel = () => {
  emit("cancel");
};

const submitForm = async () => {
  errorMessage.value = "";

  // Validate form
  const { valid } = await form.value.validate();

  if (!valid) {
    errorMessage.value = "Please fill all required fields correctly";
    return;
  }

  // Convert image_url to flickr_images array
  const rocketData: CreateRocketDto = {
    ...formData.value,
    flickr_images: formData.value.image_url ? [formData.value.image_url] : [],
    // Hapus image_url dari data yang dikirim ke API/store
    image_url: undefined,
  };

  delete rocketData.image_url; // Pastikan tidak dikirim

  emit("submit", rocketData);

  // Reset form
  formData.value = {
    rocket_name: "",
    description: "",
    image_url: "",
    country: "",
    company: "SpaceX",
    cost_per_launch: 0,
    first_flight: new Date().toISOString().split("T")[0],
    rocket_type: "rocket",
    active: true,
    success_rate_pct: 100,
    wikipedia: "",
    flickr_images: [],
  };
};
</script>

<style scoped>
.text-error {
  color: #f44336;
  font-size: 14px;
}
</style>
