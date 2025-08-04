<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import type { RocketDetail } from "@/types/rocket";
import z from "zod";

interface Props {
  modelValue: boolean;
  loading?: boolean;
  initialData?: RocketDetail;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "save", rocketData: RocketDetail): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

const form = ref();
const valid = ref(false);
const showDatePicker = ref(false);
const fileInput = ref<HTMLInputElement>();

const rocketData = ref<RocketDetail>({
  id: "",
  description: "",
  name: "",
  flickr_images: [],
  cost_per_launch: 0,
  country: "",
  first_flight: "",
});

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      rocketData.value = { ...newData };
    }
  },
  { immediate: true }
);

const rocketSchema = z.object({
  name: z.string().min(1, "Rocket name is required"),
  description: z.string().min(1, "Description is required"),
  cost_per_launch: z.number().positive("Cost must be a positive number"),
  country: z.string().min(1, "Country is required"),
  first_flight: z.string().min(1, "First flight date is required"),
  flickr_images: z.array(z.string()).optional(),
});

const validateForm = () => {
  try {
    rocketSchema.parse(rocketData.value);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: "Validation failed" } };
  }
};

const rules = {
  name: (v: string) => {
    if (!v) return "Rocket name is required";
    return true;
  },
  description: (v: string) => {
    if (!v) return "Description is required";
    return true;
  },
  cost_per_launch: (v: number) => {
    if (!v || v <= 0) return "Cost must be a positive number";
    return true;
  },
  country: (v: string) => {
    if (!v) return "Country is required";
    return true;
  },
  first_flight: (v: string) => {
    if (!v) return "First flight date is required";
    return true;
  },
};

const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

const resetForm = () => {
  rocketData.value = {
    id: "",
    description: "",
    name: "",
    flickr_images: [],
    cost_per_launch: 0,
    country: "",
    first_flight: "",
  };
  showDatePicker.value = false;

  if (fileInput.value) {
    fileInput.value.value = "";
  }
  form.value?.resetValidation();
};

const saveRocket = async () => {
  const validation = validateForm();
  console.log("Validation Result:", validation);
  console.log("Rocket date:", rocketData.value);
  if (validation.isValid) {
    emit("save", { ...rocketData.value });
  } else {
    form.value?.validate();
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            rocketData.value.flickr_images.push(result);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
};

const removeImage = (index: number) => {
  rocketData.value.flickr_images.splice(index, 1);
};

const triggerFileUpload = () => {
  fileInput.value?.click();
};
const onDateSelected = (date: string | Date) => {
  if (date instanceof Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    rocketData.value.first_flight = `${day}-${month}-${year}`;
  } else {
    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();
    rocketData.value.first_flight = `${day}-${month}-${year}`;
  }
  showDatePicker.value = false;
};

watch(dialog, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});
</script>

<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{
          props.initialData ? "Edit Rocket" : "Add New Rocket"
        }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="rocketData.name"
                  label="Rocket Name"
                  :rules="[rules.name]"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="rocketData.description"
                  label="Description"
                  :rules="[rules.description]"
                  required
                  rows="3"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model.number="rocketData.cost_per_launch"
                  label="Cost per Launch ($)"
                  type="number"
                  :rules="[rules.cost_per_launch]"
                  required
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="rocketData.country"
                  label="Country"
                  :rules="[rules.country]"
                  required
                />
              </v-col>

              <v-col cols="6">
                <v-menu
                  v-model="showDatePicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="rocketData.first_flight"
                      label="First Flight"
                      placeholder="Select a date"
                      readonly
                      v-bind="props"
                      :rules="[rules.first_flight]"
                      required
                      prepend-inner-icon="mdi-calendar"
                      clearable
                      @click:clear="rocketData.first_flight = ''"
                    />
                  </template>
                  <v-date-picker
                    :model-value="rocketData.first_flight"
                    @update:model-value="onDateSelected"
                    :max="new Date().toISOString().substr(0, 10)"
                    color="primary"
                    elevation="8"
                  />
                </v-menu>
              </v-col>

              <v-col cols="12">
                <v-card variant="outlined" class="pa-4">
                  <div class="d-flex align-center justify-space-between">
                    <v-card-title class="text-h6 mb-4">
                      Rocket Images
                    </v-card-title>

                    <v-btn
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-upload"
                      @click="triggerFileUpload"
                      class="mb-4 w-66"
                    >
                      Upload Images
                    </v-btn>

                    <input
                      ref="fileInput"
                      type="file"
                      multiple
                      accept="image/*"
                      @change="handleFileUpload"
                      style="display: none"
                    />
                  </div>
                  <!-- Image Preview -->
                  <div v-if="rocketData.flickr_images.length > 0" class="mt-4">
                    <v-card-title class="text-subtitle-1 pa-0 mb-2">
                      Uploaded Images ({{ rocketData.flickr_images.length }})
                    </v-card-title>
                    <v-row>
                      <v-col
                        v-for="(image, index) in rocketData.flickr_images"
                        :key="index"
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-card variant="outlined" class="image-preview-card">
                          <v-img :src="image" height="150" cover class="mb-2" />
                          <v-card-actions class="pa-2">
                            <v-spacer />
                            <v-btn
                              color="error"
                              size="small"
                              variant="text"
                              prepend-icon="mdi-delete"
                              @click="removeImage(index)"
                            >
                              Remove
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- No Images Message -->
                  <div v-else class="text-center pa-4">
                    <v-icon size="48" color="grey-lighten-1" class="mb-2">
                      mdi-image-outline
                    </v-icon>
                    <p class="text-body-2 text-grey-darken-1">
                      No images uploaded yet. Click "Upload Images" to add
                      rocket photos.
                    </p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <MainButton color="red-darken-1" @click="closeDialog"
          >Cancel</MainButton
        >
        <MainButton
          color="primary"
          :loading="props.loading"
          :disabled="!valid"
          @click="saveRocket"
          >{{ props.initialData ? "Update Rocket" : "Save Rocket" }}</MainButton
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.image-preview-card {
  transition: transform 0.2s ease-in-out;
}

.image-preview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
