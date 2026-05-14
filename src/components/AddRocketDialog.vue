<template>
  <v-dialog
    :model-value="modelValue"
    max-width="560"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="text-h5">Add New Rocket</v-card-title>
      <v-divider />

      <v-card-text class="pt-4">
        <v-form ref="formRef" v-model="formValid" @submit.prevent="onSubmit">
          <v-text-field
            v-model="form.name"
            label="Name *"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />
          <v-textarea
            v-model="form.description"
            label="Description *"
            :rules="[required]"
            rows="3"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />
          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            placeholder="https://..."
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />
          <v-text-field
            v-model.number="form.costPerLaunch"
            label="Cost per Launch (USD)"
            type="number"
            min="0"
            :rules="[nonNegative]"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />
          <v-text-field
            v-model="form.country"
            label="Country"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />
          <v-text-field
            v-model="form.firstFlight"
            label="First Flight"
            type="date"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />
          <v-switch
            v-model="form.active"
            label="Active"
            color="primary"
            hide-details
          />
        </v-form>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="onCancel">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :disabled="!formValid"
          @click="onSubmit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useRocketStore } from "@/stores/rocket";
import type { Rocket } from "@/stores/rocket";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const store = useRocketStore();
const formRef = ref();
const formValid = ref(false);

const initialForm = () => ({
  name: "",
  description: "",
  imageUrl: "",
  costPerLaunch: 0,
  country: "",
  firstFlight: "",
  active: true,
});

const form = reactive(initialForm());

const required = (v: string) => !!v?.trim() || "Required";
const nonNegative = (v: number) =>
  v === null || v === undefined || v >= 0 || "Must be 0 or greater";

// Reset form whenever dialog opens
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      Object.assign(form, initialForm());
      // Reset validation state on next tick
      formRef.value?.resetValidation?.();
    }
  },
);

function onCancel() {
  emit("update:modelValue", false);
}

function onSubmit() {
  if (!formValid.value) return;

  const newRocket: Rocket = {
    id: crypto.randomUUID(),
    name: form.name.trim(),
    description: form.description.trim(),
    flickr_images: form.imageUrl ? [form.imageUrl] : [],
    cost_per_launch: Number(form.costPerLaunch) || 0,
    country: form.country.trim() || "Unknown",
    first_flight: form.firstFlight || "",
    active: form.active,
  };

  store.addRocket(newRocket);
  emit("update:modelValue", false);
}
</script>
