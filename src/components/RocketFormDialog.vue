<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        size="large"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2">
        <div class="text-h5 font-weight-bold">
          Add New Rocket
        </div>
        <div class="text-body-2 text-medium-emphasis mt-1">
          Add a custom rocket to your catalogue.
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form
          ref="formRef"
          @submit.prevent="submitForm"
        >
          <v-text-field
            v-model="form.name"
            label="Rocket name"
            placeholder="e.g. Falcon Heavy"
            variant="outlined"
            maxlength="50"
            :rules="[requiredRule, nameLengthRule]"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            placeholder="Describe this rocket..."
            variant="outlined"
            rows="3"
            auto-grow
            maxlength="500"
            :rules="[descriptionLengthRule]"
          />

          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            placeholder="https://example.com/rocket.jpg"
            variant="outlined"
            prepend-inner-icon="mdi-image-outline"
            maxlength="2048"
            :rules="[imageUrlLengthRule, imageUrlRule]"
          />

          <v-text-field
            v-model="form.launchCost"
            label="Cost per launch"
            placeholder="e.g. $90 million"
            variant="outlined"
            maxlength="50"
            :rules="[launchCostLengthRule]"
          />

          <v-text-field
            v-model="form.country"
            label="Country"
            placeholder="e.g. US"
            variant="outlined"
            maxlength="50"
            :rules="[countryLengthRule]"
          />

          <v-text-field
            v-model="form.firstFlight"
            label="First flight"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />

        <v-btn
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          @click="submitForm"
        >
          Save Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { VForm } from "vuetify/components";
import type { Rocket } from "@/types/rocket";

const emit = defineEmits<{
  add: [rocket: Omit<Rocket, "id">];
}>();

const dialog = ref(false);
const formRef = ref<VForm | null>(null);

const initialForm = () => ({
  name: "",
  description: "",
  imageUrl: "",
  launchCost: "",
  country: "",
  firstFlight: "",
});

const form = ref(initialForm());

const requiredRule = (value: string): boolean | string =>
  !!value?.trim() || "Rocket name is required";

const nameLengthRule = (value: string): boolean | string =>
  value.length <= 50 || "Rocket name must not exceed 50 characters";

const descriptionLengthRule = (value: string): boolean | string =>
  value.length <= 500 || "Description must not exceed 500 characters";

const imageUrlLengthRule = (value: string): boolean | string =>
  value.length <= 2048 || "Image URL must not exceed 2048 characters";

const imageUrlRule = (value: string): boolean | string => {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:" ||
      "Image URL must use HTTP or HTTPS"
    );
  } catch {
    return "Please enter a valid image URL";
  }
};

const launchCostLengthRule = (value: string): boolean | string =>
  value.length <= 50 || "Launch cost must not exceed 50 characters";

const countryLengthRule = (value: string): boolean | string =>
  value.length <= 50 || "Country must not exceed 50 characters";

async function submitForm() {
  const result = await formRef.value?.validate();

  if (!result?.valid) {
    return;
  }

  emit("add", {
    name: form.value.name.trim(),
    description: form.value.description.trim(),
    imageUrl: form.value.imageUrl.trim() || null,
    launchCost: form.value.launchCost.trim() || null,
    country: form.value.country.trim() || null,
    firstFlight: form.value.firstFlight || null,
    isCustom: true,
  });

  closeDialog();
}

function closeDialog() {
  dialog.value = false;
  form.value = initialForm();
  formRef.value?.resetValidation();
}
</script>
