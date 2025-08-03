<template>
  <v-dialog
    v-model="dialog"
    max-width="800px"
    persistent
  >
    <template #activator="{ props }">
      <v-btn
        color="primary"
        v-bind="props"
        prepend-icon="mdi-plus"
        size="large"
        class="mb-4"
      >
        Add New Rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 pa-6">
        <v-icon class="mr-2">
          mdi-rocket
        </v-icon>
        Add New Rocket
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="handleSubmit"
        >
          <v-container>
            <v-row>
              <!-- Basic Information -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.name"
                  label="Rocket Name"
                  :rules="nameRules"
                  required
                  prepend-inner-icon="mdi-rocket"
                  variant="outlined"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="formData.country"
                  label="Country"
                  :rules="requiredRules"
                  required
                  prepend-inner-icon="mdi-flag"
                  variant="outlined"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="formData.company"
                  label="Company"
                  :rules="requiredRules"
                  required
                  prepend-inner-icon="mdi-domain"
                  variant="outlined"
                />
              </v-col>

              <!-- Status and Date -->
              <v-col
                cols="12"
                md="6"
              >
                <v-switch
                  v-model="formData.active"
                  label="Active Status"
                  color="success"
                  inset
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="formData.first_flight"
                  label="First Flight Date"
                  type="date"
                  :rules="dateRules"
                  required
                  prepend-inner-icon="mdi-calendar"
                  variant="outlined"
                />
              </v-col>

              <!-- Financial Information -->
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model.number="formData.cost_per_launch"
                  label="Cost per Launch ($)"
                  type="number"
                  :rules="numberRules"
                  required
                  prepend-inner-icon="mdi-cash"
                  variant="outlined"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model.number="formData.success_rate_pct"
                  label="Success Rate (%)"
                  type="number"
                  min="0"
                  max="100"
                  :rules="percentageRules"
                  required
                  prepend-inner-icon="mdi-trending-up"
                  variant="outlined"
                />
              </v-col>

              <!-- Links -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.wikipedia"
                  label="Wikipedia URL"
                  :rules="urlRules"
                  prepend-inner-icon="mdi-wikipedia"
                  variant="outlined"
                />
              </v-col>

              <!-- Images -->
              <v-col cols="12">
                <v-textarea
                  v-model="imageUrls"
                  label="Image URLs (one per line)"
                  rows="3"
                  prepend-inner-icon="mdi-image"
                  variant="outlined"
                  hint="Enter image URLs, one per line"
                  persistent-hint
                />
              </v-col>

              <!-- Description -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  label="Description"
                  :rules="descriptionRules"
                  required
                  rows="4"
                  prepend-inner-icon="mdi-text"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!valid"
          @click="handleSubmit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRocketsStore } from "@/stores/rockets.store";
import type { Rocket } from "@/types/rocket.type";
import {
  dateRules,
  descriptionRules,
  nameRules,
  numberRules,
  percentageRules,
  requiredRules,
  urlRules,
} from "@/utils/validation/rules.validation";

const emit = defineEmits<{
  success: [id: string];
}>();

const rocketsStore = useRocketsStore();
const dialog = ref(false);
const valid = ref(false);
const loading = ref(false);
const form = ref();

const formData = ref({
  name: "",
  country: "",
  company: "",
  active: true,
  first_flight: "",
  cost_per_launch: 0,
  success_rate_pct: 0,
  wikipedia: "",
  description: "",
});

const imageUrls = ref("");

const processedImageUrls = computed(() => {
  return imageUrls.value
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
});

const resetForm = () => {
  formData.value = {
    name: "",
    country: "",
    company: "",
    active: true,
    first_flight: "",
    cost_per_launch: 0,
    success_rate_pct: 0,
    wikipedia: "",
    description: "",
  };
  imageUrls.value = "";
  if (form.value) {
    form.value.resetValidation();
  }
};

const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

const handleSubmit = async () => {
  if (!valid.value) return;

  loading.value = true;
  try {
    const newRocket: Omit<Rocket, "id"> = {
      ...formData.value,
      first_flight: new Date(formData.value.first_flight),
      flickr_images: processedImageUrls.value,
    };

    const newId = rocketsStore.addRocket(newRocket);

    emit("success", newId);
    closeDialog();

    console.log("Rocket added successfully with ID:", newId);
  } catch (error) {
    console.error("Error adding rocket:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-form {
  .v-text-field,
  .v-textarea {
    margin-bottom: 8px;
  }
}
</style>
