<script setup lang="ts">
import { ref, watch } from "vue";
import type { RocketCreate } from "@/types/rocket";

interface Props {
  open: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [rocket: RocketCreate];
  close: [];
}>();

const formRef = ref();
const isSubmitting = ref(false);
const selectedImage = ref<File | null>(null);
const selectedDate = ref<string | null>(null);
const dateError = ref<string | null>(null);
const isDateMenuOpen = ref(false);
let imageObjectUrl: string | null = null;

const form = ref<RocketCreate>({
  full_name: "",
  description: "",
  image_url: "",
  country_code: "",
  launch_cost: null,
  maiden_flight: "",
});

const requiredRule = (value: string) => {
  return value.trim().length > 0 || "This field is required";
};

const countryCodeRule = (value: string) => {
  return (
    /^[A-Za-z]{2,3}$/.test(value.trim()) ||
    "Use a valid country code, for example USA"
  );
};

const handleImageChange = (value: File | File[] | null) => {
  if (imageObjectUrl) {
    URL.revokeObjectURL(imageObjectUrl);
    imageObjectUrl = null;
  }

  const file = Array.isArray(value) ? (value[0] ?? null) : value;
  selectedImage.value = file;

  if (!file) {
    form.value.image_url = "";
    return;
  }

  imageObjectUrl = URL.createObjectURL(file);
  form.value.image_url = imageObjectUrl;
};

const formatDateInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const handleDateChange = (value: string | Date | null) => {
  if (!value) {
    selectedDate.value = null;
  } else {
    const date = value instanceof Date ? value : new Date(value);
    selectedDate.value = formatDateInput(date);
  }

  dateError.value = null;
  isDateMenuOpen.value = false;
};

const close = () => {
  emit('close');
};

const resetForm = () => {
  if (imageObjectUrl) {
    URL.revokeObjectURL(imageObjectUrl);
    imageObjectUrl = null;
  }

  selectedImage.value = null;
  selectedDate.value = null;
  dateError.value = null;
  isDateMenuOpen.value = false;

  form.value = {
    full_name: "",
    description: "",
    image_url: "",
    country_code: "",
    launch_cost: null,
    maiden_flight: "",
  };

  formRef.value?.resetValidation();
};

const submit = async () => {
  form.value.maiden_flight = selectedDate.value;

  const validation = await formRef.value?.validate();

  if (!validation?.valid) {
    return;
  }

  isSubmitting.value = true;

  emit("submit", {
    full_name: form.value.full_name.trim(),
    description: form.value.description.trim(),
    image_url: form.value.image_url.trim(),
    country_code: form.value?.country_code?.trim().toUpperCase(),
    launch_cost: form.value?.launch_cost,
    maiden_flight: form.value?.maiden_flight,
  });

  imageObjectUrl = null;
  isSubmitting.value = false;
  close();
};

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      resetForm();
    }
  },
);
</script>

<template>
  <v-dialog
    :model-value="props.open"
    max-width="600"
    scrollable
    @update:model-value="close"
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        Add New Rocket

        <v-btn 
          icon="mdi-close" 
          variant="text" 
          @click="close" 
        />
      </v-card-title>

      <v-divider />

      <v-form 
        ref="formRef" 
        @submit.prevent="submit"
      >
        <v-card-text>
          <v-text-field
            v-model="form.full_name"
            label="Rocket name"
            placeholder="Falcon 9 Block 5"
            :rules="[requiredRule]"
            required
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            placeholder="Describe this rocket"
            rows="4"
            :rules="[requiredRule]"
            auto-grow
          />

          <v-text-field
            v-model="form.country_code"
            label="Manufacturer country code"
            placeholder="US"
            maxlength="3"
            :rules="[requiredRule, countryCodeRule]"
            @update:model-value="
              form.country_code = form?.country_code?.toUpperCase()
            "
          />

          <v-text-field
            v-model="form.launch_cost"
            label="Launch Cost"
            placeholder="Launch cost in dollars"
          />

          <div class="d-flex flex-column ga-2">
            <p class="text-body-1 text-medium-emphasis">
              Maiden Flight
            </p>

            <v-menu 
              v-model="isDateMenuOpen" 
              :close-on-content-click="false"
            >
              <template #activator="{ props: menuProps }">
                <v-text-field
                  v-bind="menuProps"
                  :model-value="selectedDate ?? ''"
                  label="Maiden flight date"
                  placeholder="YYYY-MM-DD"
                  readonly
                  :error-messages="dateError ? [dateError] : []"
                  prepend-inner-icon="mdi-calendar"
                />
              </template>

              <v-date-picker
                :model-value="selectedDate ?? undefined"
                show-adjacent-months
                @update:model-value="handleDateChange"
              />
            </v-menu>
          </div>

          <div class="d-flex flex-column ga-2">
            <p class="text-body-1 text-medium-emphasis">
              Rocket Image
            </p>
            <v-file-upload
              :model-value="selectedImage ?? undefined"
              :multiple="false"
              accept="image/*"
              clearable
              density="comfortable"
              label="Rocket image"
              show-size
              @update:model-value="handleImageChange"
            />
          </div>
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
            type="submit" 
            :loading="isSubmitting"
          >
            Add Rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
