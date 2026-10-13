<template>
  <v-dialog
    v-model="open"
    max-width="620"
  >
    <v-card class="form-card">
      <v-card-title class="d-flex justify-space-between align-center pa-6">
        Add a rocket
        <v-btn
          icon="mdi-close"
          variant="text"
          aria-label="Close"
          @click="open = false"
        />
      </v-card-title>
      <v-card-text class="px-6">
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="form.name"
            label="Rocket name"
            required
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
          />
          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            type="url"
          />
          <div class="form-grid">
            <v-text-field
              v-model="form.launchCost"
              label="Cost per launch"
              type="number"
              prefix="$"
            />
            <v-text-field
              v-model="form.country"
              label="Country"
            />
          </div>
          <v-text-field
            v-model="form.maidenFlight"
            label="First flight"
            type="date"
          />
          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            :disabled="!form.name.trim()"
          >
            Add rocket
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import type { RocketForm } from "@/types/rocket";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [form: RocketForm];
}>();
const form = reactive<RocketForm>({
  name: "",
  description: "",
  imageUrl: "",
  launchCost: "",
  country: "",
  maidenFlight: "",
});
const open = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const submit = () => {
  emit("submit", { ...form });
  Object.assign(form, {
    name: "",
    description: "",
    imageUrl: "",
    launchCost: "",
    country: "",
    maidenFlight: "",
  });
  open.value = false;
};
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
@media (max-width: 520px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
