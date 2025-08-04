<template>
  <v-form
    ref="formRef"
    v-model="isValid"
    @submit.prevent="handleSubmit"
  >
    <v-text-field
      v-model="form.name"
      label="Rocket Name"
      :rules="[(v) => !!v || 'Required']"
      required
    />
    <v-textarea
      v-model="form.description"
      label="Description"
      :rules="[(v) => !!v || 'Required']"
      required
    />

    <v-text-field
      v-model="form.height.meters"
      type="number"
      label="Height (m)"
    />
    <v-text-field
      v-model="form.diameter.meters"
      type="number"
      label="Diameter (m)"
    />
    <v-text-field
      v-model="form.mass.kg"
      type="number"
      label="Mass (kg)"
    />
    <v-text-field
      v-model="form.stages"
      type="number"
      label="Stages"
    />
    <v-text-field
      v-model="form.boosters"
      type="number"
      label="Boosters"
    />
    <v-text-field
      v-model="form.cost_per_launch"
      type="number"
      label="Cost per Launch (USD)"
    />
    <v-text-field
      v-model="form.success_rate_pct"
      type="number"
      label="Success Rate (%)"
    />

    <v-text-field
      v-model="form.first_flight"
      type="date"
      label="First Flight"
    />
    <v-text-field
      v-model="form.country"
      label="Country"
    />
    <v-text-field
      v-model="form.company"
      label="Company"
    />
    <v-text-field
      v-model="form.wikipedia"
      label="Wikipedia URL"
    />

    <v-file-input
      v-model="form.flickr_images"
      label="Upload Images"
      accept="image/*"
      multiple
      :rules="[(v) => v.length > 0 || 'At least one image is required']"
      required
    />

    <v-btn
      type="submit"
      color="primary"
    >
      Add Rocket
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import type { RocketFormData } from "@/types/rocket";
import { ref } from "vue";
import { VForm } from "vuetify/components";

const emit = defineEmits<{
  (e: "submit", data: RocketFormData): void;
}>();

const formRef = ref<InstanceType<typeof VForm> | null>(null);
const isValid = ref(true);

const form = ref({
  name: "",
  description: "",
  height: { meters: null },
  diameter: { meters: null },
  mass: { kg: null },
  stages: null,
  boosters: null,
  cost_per_launch: null,
  success_rate_pct: null,
  first_flight: "",
  country: "",
  company: "",
  wikipedia: "",
  flickr_images: [] as File[],
});

async function handleSubmit () {
  const valid = await formRef.value?.validate();
  if (!valid?.valid) return;

  const images = form.value.flickr_images.map((file) =>
    URL.createObjectURL(file)
  );

  emit("submit", {
    name: form.value.name,
    description: form.value.description,
    height: {
      meters: form.value.height.meters ?? 0,
      feet: 0,
    },
    diameter: {
      meters: form.value.diameter.meters ?? 0,
      feet: 0,
    },
    mass: {
      kg: form.value.mass.kg ?? 0,
      lb: 0,
    },
    stages: form.value.stages ?? 0,
    boosters: form.value.boosters ?? 0,
    cost_per_launch: form.value.cost_per_launch ?? 0,
    success_rate_pct: form.value.success_rate_pct ?? 0,
    first_flight: form.value.first_flight,
    country: form.value.country,
    company: form.value.company,
    wikipedia: form.value.wikipedia,
    flickr_images: images,
    active: true,
  });

  form.value = {
    name: "",
    description: "",
    height: { meters: null },
    diameter: { meters: null },
    mass: { kg: null },
    stages: null,
    boosters: null,
    cost_per_launch: null,
    success_rate_pct: null,
    first_flight: "",
    country: "",
    company: "",
    wikipedia: "",
    flickr_images: [],
  };
}
</script>
