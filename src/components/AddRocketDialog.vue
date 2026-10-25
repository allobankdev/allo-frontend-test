<template>
  <v-dialog v-model="open" max-width="560">
    <v-card rounded="xl">
      <v-card-title class="pa-5">Add a rocket</v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="submit">
          <v-text-field
            v-model="name"
            label="Rocket name"
            :rules="[rules.required]"
            required
          />

          <v-textarea v-model="description" label="Description" rows="3" />

          <v-text-field
            v-model="imageUrl"
            label="Image URL (optional)"
            placeholder="https://example.com/rocket.jpg"
          />

          <v-text-field
            v-model="launchCost"
            label="Cost per launch (optional)"
            type="number"
            min="0"
          />

          <v-text-field v-model="country" label="Country (optional)" />

          <v-text-field
            v-model="firstFlight"
            label="First flight (optional)"
            type="date"
          />

          <div class="d-flex justify-end ga-2 mt-4">
            <v-btn variant="text" @click="open = false"> Cancel </v-btn>

            <v-btn color="primary" type="submit"> Add rocket </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Rocket } from "@/types/rocket";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  add: [rocket: Rocket];
}>();

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const formRef = ref();
const name = ref("");
const description = ref("");
const imageUrl = ref("");
const launchCost = ref("");
const country = ref("");
const firstFlight = ref("");

const rules = {
  required: (value: string) => !!value.trim() || "Rocket name is required.",
};

watch(open, (value) => {
  if (!value) resetForm();
});

function resetForm() {
  name.value = "";
  description.value = "";
  imageUrl.value = "";
  launchCost.value = "";
  country.value = "";
  firstFlight.value = "";
  formRef.value?.resetValidation();
}

async function submit() {
  const result = await formRef.value?.validate();
  if (!result?.valid) return;

  const cost = launchCost.value.trim();
  const countryCode = country.value.trim();

  const rocket: Rocket = {
    id: `local-${Date.now()}`,
    full_name: name.value.trim(),
    description: description.value.trim() || null,
    image_url: imageUrl.value.trim() || null,
    launch_cost:
      cost && Number.isFinite(Number(cost)) && Number(cost) >= 0
        ? Number(cost)
        : null,
    manufacturer: countryCode ? { country_code: countryCode } : null,
    maiden_flight: firstFlight.value || null,
  };

  emit("add", rocket);
  open.value = false;
}
</script>
