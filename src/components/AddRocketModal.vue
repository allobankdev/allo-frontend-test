<script setup lang="ts">
import { reactive, computed } from "vue";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: "update:model-value", v: boolean): void;
  (
    e: "submit",
    payload: {
      name: string;
      description: string;
      images?: string[];
      country?: string;
      first_flight?: string;
      cost_per_launch?: number;
      company?: string
    }
  ): void;
}>();

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:model-value", v),
});

const form = reactive({
  name: "",
  image: "",
  description: "",
  country: "",
  first_flight: "",
  cost_per_launch: "" as unknown as number,
  company: ""
});

function reset() {
  form.name = "";
  form.image = "";
  form.description = "";
  form.country = "";
  form.first_flight = "";
  (form.cost_per_launch as any) = "";
}

function onSubmit() {
  if (!form.name.trim() || !form.description.trim()) return;
  const images = form.image.trim() ? [form.image.trim()] : [];
  emit("submit", {
    name: form.name.trim(),
    description: form.description.trim(),
    images,
    country: form.country.trim(),
    first_flight: form.first_flight.trim(),
    cost_per_launch: Number(form.cost_per_launch || 0),
  });
  reset();
  open.value = false;
}
</script>

<template>
  <v-dialog v-model="open" max-width="560">
    <v-card class="rounded-xl">
      <v-card-title class="text-h6">Add new rocket</v-card-title>
      <v-card-text>
        <div class="d-flex flex-column ga-3">
          <v-text-field v-model="form.name" label="Name *" required />
          <v-text-field v-model="form.image" label="Image URL (optional)" />
          <v-textarea
            v-model="form.description"
            label="Description *"
            rows="3"
            required
          />
          <v-text-field v-model="form.country" label="Country" />
          <v-text-field
            v-model="form.first_flight"
            label="First flight (YYYY-MM-DD)"
          />
          <v-text-field
            v-model.number="form.cost_per_launch"
            label="Cost per launch (USD)"
            type="number"
          />
          <v-text-field
            v-model.number="form.company"
            label="Company"
            type="number"
          />
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="open = false">Cancel</v-btn>
        <v-btn color="primary" prepend-icon="mdi-check" @click="onSubmit"
          >Add</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
