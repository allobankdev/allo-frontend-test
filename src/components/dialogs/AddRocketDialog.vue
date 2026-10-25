<template>
  <v-dialog
    v-model="isOpen"
    max-width="600"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5">
        Add New Rocket
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="form.full_name"
            label="Rocket name"
            placeholder="e.g. Falcon 9 Block 6"
            variant="outlined"
            :error-messages="nameError"
            required
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            placeholder="Describe the rocket..."
            variant="outlined"
            rows="3"
          />

          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            placeholder="https://..."
            variant="outlined"
          />

          <v-text-field
            v-model.number="form.launch_cost"
            label="Cost per launch"
            placeholder="e.g. 50000000"
            type="number"
            min="0"
            variant="outlined"
          />

          <v-text-field
            v-model="form.country_code"
            label="Country"
            placeholder="e.g. US"
            variant="outlined"
          />

          <v-text-field
            v-model="form.maiden_flight"
            label="First flight"
            type="date"
            variant="outlined"
          />

          <div class="d-flex justify-end ga-2 mt-4">
            <v-btn
              variant="text"
              @click="close"
            >
              Cancel
            </v-btn>

            <v-btn
              color="primary"
              type="submit"
            >
              Add Rocket
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { Rocket } from "@/types/rocket";

const emit = defineEmits<{
  add: [rocket: Omit<Rocket, "id">];
}>();

const isOpen = ref(false);

const form = reactive({
  full_name: "",
  description: "",
  image_url: "",
  launch_cost: null as number | null,
  country_code: "",
  maiden_flight: "",
});

const nameError = computed(() => {
  if (!form.full_name.trim()) {
    return "Rocket name is required.";
  }

  return "";
});

function resetForm() {
  form.full_name = "";
  form.description = "";
  form.image_url = "";
  form.launch_cost = null;
  form.country_code = "";
  form.maiden_flight = "";
}

function close() {
  isOpen.value = false;
  resetForm();
}

function submit() {
  if (!form.full_name.trim()) {
    return;
  }

  const rocket: Omit<Rocket, "id"> = {
    full_name: form.full_name.trim(),
    description: form.description.trim() || null,
    image_url: form.image_url.trim() || null,
    launch_cost: form.launch_cost,
    maiden_flight: form.maiden_flight || null,
    manufacturer: {
      country_code: form.country_code.trim() || null,
    },
  };

  emit("add", rocket);

  close();
}
</script>
