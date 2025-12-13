<template>
  <v-dialog v-model="isOpen" max-width="700" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="d-flex align-center pa-6">
        <span class="text-h4 font-weight-bold">Add New Rocket</span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="handleCancel"></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.name"
                label="Rocket Name"
                placeholder="Enter rocket name"
                prepend-inner-icon="mdi-rocket"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                color="primary"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="Description"
                placeholder="Describe the rocket specifications and capabilities"
                prepend-inner-icon="mdi-text"
                variant="outlined"
                rows="4"
                auto-grow
                :rules="[rules.required]"
                color="primary"
              ></v-textarea>
            </v-col>

            <v-col cols="12">
              <v-text-field
                :model-value="formData.flickrImages?.[0] || ''"
                @update:model-value="updateImageUrl"
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                prepend-inner-icon="mdi-image"
                variant="outlined"
                density="comfortable"
                color="primary"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-card variant="tonal" color="primary" class="pa-4">
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon
                      :icon="formData.isActive ? 'mdi-check-circle' : 'mdi-close-circle'"
                      :color="formData.isActive ? 'success' : 'error'"
                      size="28"
                      class="mr-3"
                    ></v-icon>
                    <div>
                      <div class="text-subtitle-1 font-weight-bold">Active Status</div>
                    </div>
                  </div>
                  <v-switch
                    v-model="formData.isActive"
                    color="success"
                    hide-details
                    inset
                  ></v-switch>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          size="large"
          @click="handleCancel"
          prepend-icon="mdi-close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="success"
          variant="elevated"
          size="large"
          @click="handleSubmit"
          :disabled="!isFormValid"
          prepend-icon="mdi-check"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { RocketEntity } from '@/core/entities/rocket.entity';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [data: Partial<RocketEntity>];
}>();

const isOpen = ref(props.modelValue);
const formRef = ref();

const formData = ref<Partial<RocketEntity>>({
  name: '',
  description: '',
  costPerLaunch: 0,
  country: '',
  firstFlight: '',
  flickrImages: [],
  type: 'rocket',
  isActive: true,
  company: 'SpaceX',
});

const rules = {
  required: (v: string) => !!v || 'This field is required',
};

const isFormValid = computed(() => {
  return formData.value.name && formData.value.description;
});

watch(
  () => props.modelValue,
  newVal => {
    isOpen.value = newVal;
  }
);

watch(isOpen, newVal => {
  emit('update:modelValue', newVal);
  if (!newVal) {
    resetForm();
  }
});

const updateImageUrl = (val: string) => {
  if (!formData.value.flickrImages) formData.value.flickrImages = [];
  formData.value.flickrImages[0] = val;
};

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    costPerLaunch: 0,
    country: '',
    firstFlight: '',
    flickrImages: [],
    type: 'rocket',
    isActive: true,
    company: 'SpaceX',
  };
  if (formRef.value) {
    formRef.value.reset();
  }
};

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', { ...formData.value });
    isOpen.value = false;
  }
};

const handleCancel = () => {
  isOpen.value = false;
};
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05) 0%,
    rgba(var(--v-theme-primary), 0.02) 100%
  );
}

.v-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}
</style>
