<template>
  <v-dialog
    :model-value="modelValue"
    max-width="560"
    scrim="rgba(5, 8, 13, 0.72)"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card color="surface" rounded="xl" elevation="16" class="dialog-card">
      <div class="d-flex align-center justify-space-between px-6 py-5">
        <div class="d-flex align-center ga-3">
          <span
            class="dialog-icon-badge d-inline-flex align-center justify-center"
            aria-hidden="true"
          >
            <v-icon
              icon="mdi-rocket-launch-outline"
              color="primary"
              size="20"
            />
          </span>
          <div>
            <h2 class="text-h6 font-weight-bold dialog-heading">
              Add new rocket
            </h2>
            <p class="text-caption text-medium-emphasis mb-0">
              Saved locally in your current session.
            </p>
          </div>
        </div>

        <v-btn
          icon="mdi-close"
          aria-label="Close dialog"
          variant="text"
          density="comfortable"
          @click="close"
        />
      </div>

      <v-divider />

      <v-form ref="formRef" @submit.prevent="submit">
        <v-card-text class="px-6 py-5 d-flex flex-column ga-4">
          <v-text-field
            v-model="form.fullName"
            label="Rocket name *"
            placeholder="e.g. Starship Block 2"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[requiredRule]"
          />

          <v-textarea
            v-model="form.description"
            label="Description *"
            placeholder="Brief overview of the launch vehicle..."
            variant="outlined"
            density="comfortable"
            rows="3"
            auto-grow
            hide-details="auto"
            :rules="[requiredRule]"
          />

          <div class="d-flex align-start ga-3">
            <v-text-field
              v-model="form.imageUrl"
              label="Image URL"
              placeholder="https://example.com/rocket.jpg"
              prepend-inner-icon="mdi-link-variant"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              class="flex-grow-1"
              :rules="[optionalHttpUrlRule]"
            />

            <div
              v-if="previewImageUrl"
              class="image-preview-thumb flex-shrink-0"
            >
              <RocketImage
                :src="previewImageUrl"
                alt="Rocket image preview"
                :height="48"
              />
            </div>
          </div>

          <div class="section-divider d-flex align-center ga-3 pt-1">
            <span
              class="text-caption text-medium-emphasis font-weight-medium text-no-wrap flex-shrink-0"
            >
              Optional specifications
            </span>
            <v-divider class="flex-grow-1" />
          </div>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.launchCost"
                label="Cost per launch"
                placeholder="50000000"
                prefix="$"
                type="number"
                min="0"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :rules="[optionalNonNegativeNumberRule]"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.countryCode"
                label="Country"
                placeholder="USA"
                prepend-inner-icon="mdi-earth"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12" class="pt-3">
              <v-text-field
                v-model="form.maidenFlight"
                label="First flight"
                type="date"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="px-6 py-4 justify-end ga-2">
          <v-btn variant="text" rounded="lg" class="text-none" @click="close">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            rounded="lg"
            type="submit"
            class="text-none px-5"
          >
            Add rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import RocketImage from "@/components/RocketImage.vue";
import type { NewRocketInput } from "@/types/rocket";
import {
  optionalHttpUrlRule,
  optionalNonNegativeNumberRule,
  requiredRule,
} from "@/utils/validators";

interface FormInstance {
  validate: () => Promise<{ valid: boolean }>;
  resetValidation: () => void;
}

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [payload: NewRocketInput];
}>();

const formRef = ref<FormInstance | null>(null);

const form = reactive({
  fullName: "",
  description: "",
  imageUrl: "",
  launchCost: "",
  countryCode: "USA",
  maidenFlight: "",
});

const previewImageUrl = computed<string | null>(() => {
  const trimmed = form.imageUrl.trim();
  if (!trimmed || optionalHttpUrlRule(trimmed) !== true) {
    return null;
  }
  return trimmed;
});

function resetForm() {
  form.fullName = "";
  form.description = "";
  form.imageUrl = "";
  form.launchCost = "";
  form.countryCode = "USA";
  form.maidenFlight = "";
  formRef.value?.resetValidation();
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      resetForm();
    }
  },
);

function close() {
  emit("update:modelValue", false);
}

async function submit() {
  const result = await formRef.value?.validate();
  if (!result?.valid) return;

  const parsedCost = form.launchCost === "" ? null : Number(form.launchCost);

  emit("submit", {
    fullName: form.fullName.trim(),
    description: form.description.trim(),
    imageUrl: form.imageUrl.trim() || undefined,
    launchCost:
      parsedCost !== null && Number.isFinite(parsedCost) ? parsedCost : null,
    countryCode: form.countryCode.trim() || undefined,
    maidenFlight: form.maidenFlight.trim() || undefined,
  });
  close();
}
</script>

<style scoped>
.dialog-card {
  border: 1px solid var(--app-border-strong);
}

.dialog-icon-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.28);
}

.dialog-heading {
  line-height: 1.25;
}

.image-preview-thumb {
  width: 56px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--app-border-strong);
}
</style>
