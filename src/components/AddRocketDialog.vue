<template>
  <v-dialog v-model="isOpen" max-width="600" persistent>
    <v-card>
      <v-card-title class="text-h6 font-weight-bold d-flex align-center">
        <v-icon icon="mdi-rocket-launch" class="mr-2" color="primary" />
        Add New Rocket
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-4">
        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.full_name"
            label="Rocket Name *"
            placeholder="e.g. Starship Block 2"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            class="mb-3"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            placeholder="Provide a brief overview of the launcher configuration..."
            variant="outlined"
            density="comfortable"
            rows="3"
            class="mb-3"
          />

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.launch_cost"
                label="Cost Per Launch (USD)"
                placeholder="e.g. 50000000"
                type="number"
                variant="outlined"
                density="comfortable"
                class="mb-3"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.country_code"
                label="Country Code"
                placeholder="e.g. USA"
                variant="outlined"
                density="comfortable"
                class="mb-3"
              />
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.maiden_flight"
                label="First Flight Date"
                type="date"
                variant="outlined"
                density="comfortable"
                class="mb-3"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.image_url"
                label="Image URL"
                placeholder="https://..."
                variant="outlined"
                density="comfortable"
                class="mb-3"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useRockets } from '@/composables/useRockets';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created'): void;
}>();

const { addCustomRocket } = useRockets();

const isOpen = ref(props.modelValue);
const isFormValid = ref(false);
const formRef = ref();

const form = reactive({
  full_name: '',
  description: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
  image_url: '',
});

const rules = {
  required: (v: string) => !!v?.trim() || 'This field is required',
};

watch(() => props.modelValue, (val) => {
  isOpen.value = val;
});

watch(isOpen, (val) => {
  emit('update:modelValue', val);
  if (!val) {
    resetForm();
  }
});

function resetForm() {
  form.full_name = '';
  form.description = '';
  form.launch_cost = '';
  form.country_code = 'USA';
  form.maiden_flight = '';
  form.image_url = '';
  if (formRef.value) {
    formRef.value.resetValidation();
  }
}

function closeDialog() {
  isOpen.value = false;
}

function handleSubmit() {
  if (!form.full_name.trim()) return;

  addCustomRocket({
    full_name: form.full_name.trim(),
    name: form.full_name.trim(),
    description: form.description.trim() || null,
    launch_cost: form.launch_cost ? parseFloat(form.launch_cost) : null,
    maiden_flight: form.maiden_flight || null,
    image_url: form.image_url.trim() || null,
    manufacturer: form.country_code ? { name: 'SpaceX', country_code: form.country_code.toUpperCase().trim() } : null,
  });

  emit('created');
  closeDialog();
}
</script>
