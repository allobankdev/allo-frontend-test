<script setup lang="ts">
import { reactive, ref, watch } from "vue";

import { useRocketStore } from "@/stores/rocket";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const rocketStore = useRocketStore();
const formIsValid = ref(false);

const initialForm = () => ({
  name: "",
  description: "",
  imageUrl: "",
  launchCost: "",
  countryCode: "",
  maidenFlight: "",
});

const form = reactive(initialForm());

const requiredRule = (value: string) =>
  value.trim().length > 0 || "Rocket name is required";

const urlRule = (value: string) => {
  if (!value) return true;

  try {
    new URL(value);
    return true;
  } catch {
    return "Enter a valid image URL";
  }
};

function closeDialog(): void {
  emit("update:modelValue", false);
}

function resetForm(): void {
  Object.assign(form, initialForm());
  formIsValid.value = false;
}

function submit(): void {
  if (!formIsValid.value || !form.name.trim()) {
    return;
  }

  const countryCode = form.countryCode.trim().toUpperCase();

  rocketStore.addRocket({
    full_name: form.name.trim(),
    description: form.description.trim() || null,
    image_url: form.imageUrl.trim() || null,
    launch_cost: form.launchCost.trim() || null,
    maiden_flight: form.maidenFlight || null,
    manufacturer: countryCode
      ? {
          country_code: countryCode,
        }
      : null,
  });

  closeDialog();
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      resetForm();
    }
  },
);
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="650"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Add Rocket</span>

        <v-btn
          aria-label="Close"
          icon="mdi-close"
          variant="text"
          @click="closeDialog"
        />
      </v-card-title>

      <v-divider />

      <v-form
        v-model="formIsValid"
        @submit.prevent="submit"
      >
        <v-card-text>
          <v-text-field
            v-model="form.name"
            label="Rocket name"
            :rules="[requiredRule]"
            variant="outlined"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
            variant="outlined"
          />

          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            :rules="[urlRule]"
            type="url"
            variant="outlined"
          />

          <v-text-field
            v-model="form.launchCost"
            label="Cost per launch"
            min="0"
            type="number"
            variant="outlined"
          />

          <v-text-field
            v-model="form.countryCode"
            counter="3"
            label="Country code"
            maxlength="3"
            variant="outlined"
          />

          <v-text-field
            v-model="form.maidenFlight"
            label="First flight"
            type="date"
            variant="outlined"
          />
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-spacer />

          <v-btn
            variant="text"
            @click="closeDialog"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            :disabled="!formIsValid"
            type="submit"
            variant="flat"
          >
            Add Rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
