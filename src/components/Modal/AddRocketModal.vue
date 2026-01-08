<script setup lang="ts">
import { ref, computed } from "vue";
import { useRocketStore } from "@/stores/rocketStore";
import type { Rocket } from "@/types/rocketTypes";

const emit = defineEmits(["close"]);

const rocketStore = useRocketStore();

const dialog = ref(true);
const newRocket = ref<Rocket>({
  id: `rocket-${Date.now()}`,
  name: "",
  description: "",
  flickr_images: [""],
  cost_per_launch: 0,
  country: "",
  first_flight: new Date().toISOString().split("T")[0],
  company: "",
  active: true,
});

const isFormValid = computed(() => {
  return (
    newRocket.value.name.trim() !== "" &&
    newRocket.value.description.trim() !== "" &&
    newRocket.value.country.trim() !== "" &&
    newRocket.value.cost_per_launch >= 0
  );
});

function addRocket() {
  if (isFormValid.value) {
    rocketStore.addRocket(newRocket.value);
    emit("close");
  }
}

function closeDialog() {
  emit("close");
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    persistent
    aria-labelledby="add-rocket-title"
    aria-describedby="add-rocket-description"
  >
    <v-card class="add-rocket-card">
      <v-card-title id="add-rocket-title" class="text-h5 card-title">
        <v-icon left color="primary"> mdi-rocket-launch </v-icon>
        Add New Rocket
      </v-card-title>

      <v-card-subtitle id="add-rocket-description" class="card-subtitle">
        Fill in the details for the new rocket you want to add to the collection
      </v-card-subtitle>

      <v-card-text>
        <v-form class="rocket-form" @submit.prevent="addRocket">
          <v-text-field
            v-model="newRocket.name"
            label="Rocket Name"
            required
            :rules="[(v) => !!v || 'Rocket name is required']"
            prepend-inner-icon="mdi-rocket"
            clearable
            aria-required="true"
          />

          <v-textarea
            v-model="newRocket.description"
            label="Description"
            required
            :rules="[(v) => !!v || 'Description is required']"
            prepend-inner-icon="mdi-text"
            clearable
            rows="3"
            auto-grow
            aria-required="true"
          />

          <v-text-field
            v-model="newRocket.country"
            label="Country"
            required
            :rules="[(v) => !!v || 'Country is required']"
            prepend-inner-icon="mdi-earth"
            clearable
            aria-required="true"
          />

          <v-text-field
            v-model.number="newRocket.cost_per_launch"
            label="Cost per Launch (USD)"
            type="number"
            required
            :rules="[
              (v) => !!v || 'Cost is required',
              (v) => v >= 0 || 'Cost must be positive',
            ]"
            prepend-inner-icon="mdi-currency-usd"
            clearable
            min="0"
            aria-required="true"
          />

          <v-text-field
            v-model="newRocket.first_flight"
            label="First Flight Date"
            type="date"
            required
            :rules="[(v) => !!v || 'Date is required']"
            prepend-inner-icon="mdi-calendar"
            clearable
            aria-required="true"
          />

          <v-text-field
            v-model="newRocket.flickr_images[0]"
            label="Image URL (optional)"
            prepend-inner-icon="mdi-image"
            clearable
            placeholder="https://example.com/rocket.jpg"
          />

          <v-switch
            v-model="newRocket.active"
            label="Active Status"
            color="success"
            hide-details
            inset
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="card-actions">
        <v-btn
          color="error"
          variant="outlined"
          class="cancel-button"
          aria-label="Cancel and close dialog"
          @click="closeDialog"
        >
          <v-icon left> mdi-cancel </v-icon>
          Cancel
        </v-btn>

        <v-spacer />

        <v-btn
          color="success"
          variant="elevated"
          :disabled="!isFormValid"
          class="add-button"
          aria-label="Add new rocket to collection"
          @click="addRocket"
        >
          <v-icon left> mdi-plus </v-icon>
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
@use "../../styles/settings.scss" as *;

.add-rocket-card {
  border-radius: $border-radius-md;
  overflow: hidden;
  background: $bg-surface;
  animation: fade-in 0.2s ease-out;

  .card-title {
    color: $primary-light;
    font-weight: $font-weight-bold;
    letter-spacing: 0.4px;
    padding: $spacing-md $spacing-md $spacing-sm;
    background: rgba($primary-color, 0.1);
    border-bottom: 1px solid $border-color;
  }

  .card-subtitle {
    color: $text-secondary;
    padding: $spacing-sm $spacing-md;
    background: rgba($bg-dark, 0.1);
  }

  .v-card-text {
    padding: $spacing-md;
  }

  .rocket-form {
    .v-text-field,
    .v-textarea {
      margin-bottom: $spacing-md;
    }
  }

  .card-actions {
    padding: $spacing-md;
    background: rgba($bg-dark, 0.05);
    border-top: 1px solid $border-color;
  }

  .cancel-button {
    margin-right: $spacing-sm;
  }

  .add-button {
    min-width: 120px;
  }
}
</style>
