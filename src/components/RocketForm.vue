<script setup lang="ts">
import { useRocketStore } from "@/store";
import { convertToBase64, formatDate } from "@/utils";
import { ref } from "vue";

const model = defineModel<boolean>();
const { createRocket } = useRocketStore();

const form = ref({
  name: "",
  description: "",
  cost_per_launch: "",
  country: "",
  first_flight: "",
  images: [] as File[],
});

const previewImages = ref<string[]>([]);

const handleUpload = (files: File | File[] | null) => {
  if (!files) return;

  const fileArray = Array.isArray(files) ? files : [files];

  form.value.images = fileArray;

  previewImages.value = fileArray.map((file) => URL.createObjectURL(file));
};

const removeImage = (index: number) => {
  form.value.images.splice(index, 1);
  previewImages.value.splice(index, 1);
};

const submit = async () => {
  const imagesBase64 = await Promise.all(
    form.value.images.map((file) => convertToBase64(file)),
  );

  const payload = {
    name: form.value.name,
    description: form.value.description,
    cost_per_launch: Number(form.value.cost_per_launch),
    country: form.value.country,
    first_flight: formatDate(form.value.first_flight),
    flickr_images: imagesBase64,
  };

  createRocket(payload);

  model.value = false;

  resetForm();
};

const resetForm = () => {
  form.value = {
    name: "",
    description: "",
    cost_per_launch: "",
    country: "",
    first_flight: "",
    images: [],
  };

  previewImages.value = [];
};
</script>

<template>
  <v-dialog v-model="model" max-width="700">
    <v-card>
      <v-card-title class="text-h6"> Create Rocket </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="form.name"
          label="Rocket Name"
          variant="outlined"
          class="mb-3"
        />

        <v-textarea
          v-model="form.description"
          label="Description"
          variant="outlined"
          class="mb-3"
        />

        <v-text-field
          v-model="form.cost_per_launch"
          label="Cost per launch"
          type="number"
          variant="outlined"
          class="mb-3"
        />

        <v-text-field
          v-model="form.country"
          label="Country"
          variant="outlined"
          class="mb-3"
        />

        <v-text-field
          v-model="form.first_flight"
          label="First Flight"
          type="date"
          variant="outlined"
          class="mb-3"
        />

        <v-file-input
          label="Upload Images"
          multiple
          accept="image/*"
          prepend-icon="mdi-camera"
          variant="outlined"
          @update:modelValue="handleUpload"
        />

        <v-row class="mt-3">
          <v-col
            v-for="(image, index) in previewImages"
            :key="index"
            cols="6"
            md="4"
          >
            <v-card>
              <v-img :src="image" height="150" cover />

              <v-card-actions>
                <v-btn
                  color="error"
                  variant="text"
                  block
                  @click="removeImage(index)"
                >
                  Remove
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn variant="text" @click="model = false"> Cancel </v-btn>

        <v-btn color="primary" @click="submit"> Create </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
