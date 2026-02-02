<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template v-slot:activator="{ props }">
      <v-btn
        color="primary"
        v-bind="props"
        prepend-icon="mdi-plus"
        size="large"
      >
        Add New Rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 pa-4"> Add New Rocket </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="valid" @submit.prevent="submitForm">
          <v-text-field
            v-model="formData.name"
            label="Rocket Name *"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          ></v-text-field>

          <v-textarea
            v-model="formData.description"
            label="Description *"
            :rules="[rules.required]"
            variant="outlined"
            rows="3"
            class="mb-2"
          ></v-textarea>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.country"
                label="Country *"
                :rules="[rules.required]"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.company"
                label="Company *"
                :rules="[rules.required]"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="formData.cost_per_launch"
                label="Cost per Launch (USD) *"
                :rules="[rules.required, rules.number]"
                type="number"
                variant="outlined"
                prefix="$"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.first_flight"
                label="First Flight Date *"
                :rules="[rules.required]"
                type="date"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            v-model="imageUrl"
            label="Image URL (Optional)"
            variant="outlined"
            hint="Enter an image URL for the rocket"
            persistent-hint
            class="mb-2"
          ></v-text-field>

          <v-chip-group v-if="formData.flickr_images.length > 0" class="mb-2">
            <v-chip
              v-for="(img, index) in formData.flickr_images"
              :key="index"
              closable
              @click:close="removeImage(index)"
              color="primary"
              variant="outlined"
            >
              Image {{ index + 1 }}
            </v-chip>
          </v-chip-group>

          <v-btn
            v-if="imageUrl"
            color="secondary"
            variant="outlined"
            @click="addImage"
            class="mb-4"
            block
          >
            <v-icon start>mdi-plus</v-icon>
            Add Image URL
          </v-btn>

          <v-alert
            v-if="formData.flickr_images.length === 0"
            type="info"
            variant="tonal"
            density="compact"
          >
            No images added. A placeholder will be used.
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="closeDialog"> Cancel </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="submitForm"
          :disabled="!valid"
          :loading="loading"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRocketStore } from "@/stores/rockets";
import type { RocketFormData } from "@/types/rocket";

const rocketStore = useRocketStore();

const dialog = ref(false);
const valid = ref(false);
const loading = ref(false);
const formRef = ref<any>(null);
const imageUrl = ref("");

const formData = ref<RocketFormData>({
  name: "",
  description: "",
  country: "",
  company: "",
  cost_per_launch: 0,
  first_flight: "",
  flickr_images: [],
});

const rules = {
  required: (value: any) => !!value || "This field is required",
  number: (value: any) => {
    if (!value) return true;
    return !isNaN(value) || "Must be a number";
  },
};

const addImage = () => {
  if (
    imageUrl.value &&
    !formData.value.flickr_images.includes(imageUrl.value)
  ) {
    formData.value.flickr_images.push(imageUrl.value);
    imageUrl.value = "";
  }
};

const removeImage = (index: number) => {
  formData.value.flickr_images.splice(index, 1);
};

const submitForm = async () => {
  if (!formRef.value) return;

  const { valid: isValid } = await formRef.value.validate();

  if (isValid) {
    loading.value = true;
    try {
      await rocketStore.addRocket(formData.value);
      closeDialog();
      resetForm();
    } catch (error) {
      console.error("Error adding rocket:", error);
    } finally {
      loading.value = false;
    }
  }
};

const closeDialog = () => {
  dialog.value = false;
};

const resetForm = () => {
  formData.value = {
    name: "",
    description: "",
    country: "",
    company: "",
    cost_per_launch: 0,
    first_flight: "",
    flickr_images: [],
  };
  imageUrl.value = "";
  if (formRef.value) {
    formRef.value.reset();
  }
};
</script>

<style scoped>
:deep(.v-field__input) {
  min-height: 40px;
}
</style>
