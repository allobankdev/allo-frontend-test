<template>
  <v-dialog
    :model-value="modelValue"
    max-width="680"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="dialog-card">
      <div class="dialog__head">
        <div>
          <p class="u-label">
            Local session entry
          </p>
          <h2>Add a rocket</h2>
        </div>
        <v-btn
          aria-label="Close dialog"
          icon
          size="small"
          variant="text"
          @click="closeDialog"
        >
          <v-icon
            icon="mdi-close"
            size="20"
          />
        </v-btn>
      </div>

      <p class="dialog__note">
        The Launch Library API is read-only. New rockets are stored in this
        session only and disappear on reload.
      </p>

      <v-form
        ref="formRef"
        v-model="isFormValid"
        @submit.prevent="handleSubmit"
      >
        <div class="dialog__grid">
          <div class="span-7">
            <v-text-field
              v-model="formData.full_name"
              label="Rocket full name *"
              placeholder="e.g. Falcon Heavy Block 5"
              :rules="[rules.required]"
            />
          </div>

          <div class="span-5">
            <v-text-field
              v-model="formData.name"
              label="Short name"
              placeholder="e.g. Falcon Heavy"
            />
          </div>

          <div class="span-12">
            <v-textarea
              v-model="formData.description"
              label="Description *"
              placeholder="Describe the launch vehicle, configuration, or mission capabilities…"
              rows="3"
              :rules="[rules.required]"
            />
          </div>

          <div class="span-6">
            <v-text-field
              v-model="formData.launch_cost"
              label="Launch cost (USD)"
              placeholder="e.g. 62000000"
              prefix="$"
              type="number"
              hint="Cost per launch in US dollars"
              persistent-hint
            />
          </div>

          <div class="span-6">
            <v-text-field
              v-model="formData.country_code"
              label="Manufacturer country"
              placeholder="e.g. USA"
              hint="ISO code, e.g. USA, IDN, EUR"
              persistent-hint
            />
          </div>

          <div class="span-6">
            <v-text-field
              v-model="formData.maiden_flight"
              label="First flight date"
              type="date"
            />
          </div>

          <div class="span-6">
            <v-text-field
              v-model="formData.image_url"
              label="Image URL"
              placeholder="https://…"
              prepend-inner-icon="mdi-image-outline"
            />
          </div>

          <div class="span-6">
            <v-switch
              v-model="formData.active"
              label="Vehicle is active"
            />
          </div>

          <div class="span-6">
            <v-switch
              v-model="formData.reusable"
              label="Reusable stages"
            />
          </div>
        </div>
      </v-form>

      <div class="dialog__actions">
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          Save rocket
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { Rocket } from '@/types/rocket';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'submit', rocket: Omit<Rocket, 'id'>): void;
}>();

const formRef = ref();
const isFormValid = ref(false);

const initialForm = {
  full_name: '',
  name: '',
  description: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
  image_url: '',
  active: true,
  reusable: true,
};

const formData = reactive({ ...initialForm });

const rules = {
  required: (v: string) => !!v?.trim() || 'This field is required',
};

function resetForm() {
  Object.assign(formData, initialForm);
  if (formRef.value) {
    formRef.value.resetValidation();
  }
}

function closeDialog() {
  resetForm();
  emit('update:modelValue', false);
}

async function handleSubmit() {
  const validation = await formRef.value?.validate();
  if (!validation?.valid) return;

  const fullName = formData.full_name.trim();
  const description = formData.description.trim();
  if (!fullName || !description) return;

  const rocketPayload: Omit<Rocket, 'id'> = {
    name: formData.name.trim() || fullName,
    full_name: fullName,
    description,
    launch_cost: formData.launch_cost ? formData.launch_cost : null,
    maiden_flight: formData.maiden_flight || null,
    image_url: formData.image_url.trim() || null,
    active: formData.active,
    reusable: formData.reusable,
    manufacturer: {
      name: 'SpaceX',
      country_code: formData.country_code.trim() || 'USA',
    },
  };

  emit('submit', rocketPayload);
  closeDialog();
}
</script>

<style scoped>
.dialog-card {
  max-height: 90dvh;
  overflow-y: auto;
  padding: clamp(20px, 3vw, 32px);
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--fleet-hairline);
}

.dialog__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.dialog__head h2 {
  margin: 8px 0 0;
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 600;
  letter-spacing: -0.025em;
}

.dialog__note {
  margin: 16px 0 24px;
  padding: 12px 14px;
  border-left: 2px solid rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.07);
  font-size: 12.5px;
  line-height: 1.6;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.dialog__grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
}

.span-5 {
  grid-column: span 5;
}

.span-6 {
  grid-column: span 6;
}

.span-7 {
  grid-column: span 7;
}

.span-12 {
  grid-column: span 12;
}

.dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--fleet-hairline);
}

@media (max-width: 600px) {
  .span-5,
  .span-6,
  .span-7,
  .span-12 {
    grid-column: span 12;
  }
}
</style>
