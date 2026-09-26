<script setup lang="ts">
import { reactive, ref, watch } from "vue";

const props = defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (
    e: "submit",
    payload: {
      name: string;
      description: string;
      imageUrl: string;
      costPerLaunch: string;
      country: string;
      firstFlight: string;
    },
  ): void;
}>();

const form = reactive({
  name: "",
  description: "",
  imageUrl: "",
  costPerLaunch: "",
  country: "",
  firstFlight: "",
});

const nameError = ref<string | null>(null);

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      Object.assign(form, {
        name: "",
        description: "",
        imageUrl: "",
        costPerLaunch: "",
        country: "",
        firstFlight: "",
      });
      nameError.value = null;
    }
  },
);

function close() {
  emit("update:modelValue", false);
}

function handleSubmit() {
  const trimmedName = form.name.trim();
  if (!trimmedName) {
    nameError.value = "Give the rocket a name.";
    return;
  }

  emit("submit", {
    name: trimmedName,
    description: form.description.trim(),
    imageUrl: form.imageUrl.trim(),
    costPerLaunch: form.costPerLaunch.trim(),
    country: form.country.trim(),
    firstFlight: form.firstFlight,
  });
  close();
}
</script>

<template>
  <v-dialog
    :model-value="props.modelValue"
    max-width="480"
    scrollable
    class="rocket-dialog"
    @update:model-value="(value: boolean) => emit('update:modelValue', value)"
  >
    <v-card rounded="lg">
      <v-card-item class="py-4">
        <template #prepend>
          <v-avatar
            color="primary"
            variant="tonal"
            size="40"
          >
            <v-icon
              icon="mdi-rocket-launch-outline"
              size="22"
            />
          </v-avatar>
        </template>
        <v-card-title class="text-h6">
          Add a rocket
        </v-card-title>
        <v-card-subtitle>It'll show up in your list right away</v-card-subtitle>
        <template #append>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="close"
          />
        </template>
      </v-card-item>

      <v-divider />

      <v-card-text class="pt-5">
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            label="Name"
            placeholder="e.g. Starship"
            prepend-inner-icon="mdi-rocket-outline"
            variant="outlined"
            density="comfortable"
            :error-messages="nameError ? [nameError] : []"
            autofocus
            class="mb-1"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            placeholder="What makes this rocket notable?"
            prepend-inner-icon="mdi-text-long"
            variant="outlined"
            density="comfortable"
            rows="3"
            auto-grow
            class="mb-1"
          />

          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            placeholder="https://…"
            prepend-inner-icon="mdi-image-outline"
            variant="outlined"
            density="comfortable"
            type="url"
            class="mb-1"
          />

          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="form.costPerLaunch"
                label="Cost per launch"
                placeholder="67000000"
                prepend-inner-icon="mdi-currency-usd"
                variant="outlined"
                density="comfortable"
                type="number"
                min="0"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.country"
                label="Country"
                placeholder="USA"
                prepend-inner-icon="mdi-earth"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.firstFlight"
            label="First flight"
            prepend-inner-icon="mdi-calendar-outline"
            variant="outlined"
            density="comfortable"
            type="date"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          @click="handleSubmit"
        >
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
:deep(.v-overlay__scrim) {
  backdrop-filter: blur(10px);
}

:deep(.v-field) {
  border-radius: 10px;
}
</style>
