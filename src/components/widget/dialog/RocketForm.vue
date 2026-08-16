<template>
  <v-dialog v-model="dialog" max-width="520">
    <v-card class="rounded-xl">
      <!-- Header -->
      <v-card-title
        class="text-h6 font-weight-bold d-flex align-center gap-2 px-6 py-2"
      >
        🚀 Add New Rocket
      </v-card-title>

      <v-divider />

      <!-- Form -->
      <v-card-text class="py-4">
        <BaseInput
          v-model="form.name"
          label="Rocket Name"
          placeholder="Falcon 9"
          required
        />

        <BaseTextArea
          v-model="form.description"
          label="Description"
          placeholder="Rocket description..."
          required
        />

        <BaseInput v-model="form.image" label="Image URL" />

        <BaseInput v-model="form.country" label="Country" required />
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions class="px-4 py-3">
        <v-spacer />

        <v-btn variant="text" @click="close"> Cancel </v-btn>

        <v-btn
          variant="flat"
          color="primary"
          :disabled="!isValid"
          @click="submit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import type { Rocket } from "@/types/rocket";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue", "submit"]);

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit("update:modelValue", val),
});

const form = reactive({
  name: "",
  description: "",
  image: "",
  country: "",
});

const required = (v: string) => !!v || "Field is required";

const isValid = computed(() => {
  return !!form.name && !!form.description && !!form.country;
});

const close = () => {
  dialog.value = false;
};

const submit = () => {
  if (!isValid.value) return;
  const newRocket: Rocket = {
    id: Date.now().toString(),
    name: form.name,
    description: form.description,
    flickr_images: [form.image],
    height: { meters: 0, feet: 0 },
    diameter: { meters: 0, feet: 0 },
    mass: { kg: 0, lb: 0 },
    cost_per_launch: 0,
    success_rate_pct: 0,
    first_flight: new Date().toISOString(),
    country: form.country || "Unknown",
    company: "Custom",
    payload_weights: [],
  };

  emit("submit", newRocket);

  // reset
  form.name = "";
  form.description = "";
  form.image = "";
  form.country = "";

  dialog.value = false;
};
</script>
