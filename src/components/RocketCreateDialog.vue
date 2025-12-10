<template>
  <v-dialog v-model="model" max-width="600">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        Add New Rocket
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="isValid">
          <v-text-field
            v-model="form.name"
            label="Rocket name"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            rows="3"
            class="mb-3"
          />

          <v-text-field
            v-model="form.image"
            label="Image URL"
            type="url"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            hint="Direct URL to an image (optional)"
            persistent-hint
          />

          <v-text-field
            v-model.number="form.cost_per_launch"
            label="Cost per launch (USD)"
            :rules="[required, mustBePositiveNumber]"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            type="number"
          />

          <v-text-field
            v-model="form.country"
            label="Country"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />

          <v-text-field
            v-model="form.first_flight"
            label="First flight (YYYY-MM-DD)"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            class="mb-1"
            placeholder="2006-03-24"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn variant="text" @click="close"> Cancel </v-btn>

        <v-btn color="primary" :disabled="!isValid" @click="submit">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import type { NewRocketPayload } from "@/stores/rockets";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", value: NewRocketPayload): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const formRef = ref();
const isValid = ref(false);

const initialForm: NewRocketPayload = {
  name: "",
  description: "",
  image: "",
  cost_per_launch: 0,
  country: "",
  first_flight: "",
};

const form = reactive<NewRocketPayload>({ ...initialForm });

watch(
  () => props.modelValue,
  (opened) => {
    if (opened) {
      Object.assign(form, initialForm);
      isValid.value = false;
    }
  }
);

const required = (value: string | number) =>
  !!String(value).trim() || "Field is required";

const mustBePositiveNumber = (value: number) =>
  (value && value > 0) || "Must be a positive number";

function close() {
  model.value = false;
}

async function submit() {
  const formInstance = formRef.value as any;
  if (formInstance) {
    const res = await formInstance.validate();
    if (!res.valid) return;
  }

  emit("submit", { ...form });
}
</script>
