<script lang="ts" setup>
import type { Rocket } from "@/stores/rocket";
import { useRocket } from "@/stores/rocket";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { VDateInput } from "vuetify/labs/VDateInput";
import { VFileUpload } from "vuetify/labs/VFileUpload";

const form = reactive<Rocket>({
  id: "",
  full_name: "",
  description: "",
  image_url: "",
  launch_cost: "",
  maiden_flight: "",
  manufacturer: {
    country_code: "",
  },
});
const imageFiles = ref<File[]>([]);
const imagePreviewUrl = ref("");
const selectedDate = ref<Date | null>(null);
const rocketStore = useRocket();
const router = useRouter();

const handleImageChange = (files: File[]) => {
  if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value);

  imageFiles.value = files;
  imagePreviewUrl.value = files[0] ? URL.createObjectURL(files[0]) : "";
};

const submit = async () => {
  const rocket = {
    ...form,
    id: `local-${crypto.randomUUID()}`,
    image_url: imagePreviewUrl.value,
    maiden_flight: selectedDate.value?.toISOString() ?? "",
    manufacturer: { ...form.manufacturer },
  };

  await rocketStore.addNewRocket(rocket);
};

</script>

<template>
  <v-dialog scrollable transition="dialog-bottom-transition" max-width="800">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="primary" prepend-icon="mdi-plus">
        Add Rocket
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-form
        @submit.prevent="
          async () => {
            await submit();
            isActive.value = false;
          }
        "
      >
        <v-card title="Add new rocket">
          <v-divider class="mt-3"></v-divider>

          <template #append>
            <v-btn
              type="button"
              icon="mdi-close"
              variant="text"
              @click="isActive.value = false"
            ></v-btn>
          </template>

          <v-card-text class="px-4" style="max-height: 100%">
            <v-row align="stretch">
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.full_name"
                  label="Rocket Name"
                  required
                ></v-text-field>
                <v-textarea
                  v-model="form.description"
                  label="Description"
                  required
                ></v-textarea>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form.manufacturer.country_code"
                      label="Country"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <VDateInput
                      v-model="selectedDate"
                      prepend-icon=""
                      label="Select a date"
                    />
                  </v-col>
                </v-row>
                <v-text-field
                  v-model="form.launch_cost"
                  label="Cost per Launch"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <VFileUpload
                  v-model="imageFiles"
                  class="rocket-upload"
                  icon="mdi-rocket"
                  title="Drop Rocket Image Here"
                  browse-text="Browse file"
                  density="default"
                  accept="image/*"
                  inset-file-list
                  @update:model-value="handleImageChange"
                >
                  <template #single>
                    <v-img
                      :src="imagePreviewUrl"
                      class="rocket-preview"
                      cover
                    ></v-img>
                  </template>
                </VFileUpload>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-btn
              type="submit"
              color="primary"
              text="save"
              variant="flat"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </template>
  </v-dialog>
</template>

<style scoped>
.rocket-upload {
  height: 100%;
}

.rocket-upload :deep(.v-input__control),
.rocket-upload :deep(.v-file-upload-dropzone) {
  height: 100%;
}

.rocket-preview {
  width: 100%;
  aspect-ratio: 4 / 5;
}
</style>
