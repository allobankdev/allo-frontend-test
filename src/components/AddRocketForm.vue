<template>
  <v-dialog
    :model-value="modelValue"
    max-width="560"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="text-h6">
        Add rocket
      </v-card-title>

      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="onSubmit"
        >
          <v-text-field
            v-model="form.fullName"
            :rules="nameRules"
            class="mb-2"
            label="Name"
            required
            variant="outlined"
          />

          <v-textarea
            v-model="form.description"
            auto-grow
            class="mb-2"
            label="Description"
            rows="3"
            variant="outlined"
          />

          <v-text-field
            v-model="form.imageUrl"
            class="mb-2"
            label="Image URL"
            variant="outlined"
          />

          <v-text-field
            v-model="form.launchCost"
            class="mb-2"
            label="Cost per launch"
            variant="outlined"
          />

          <v-text-field
            v-model="form.countryCode"
            class="mb-2"
            label="Country code"
            variant="outlined"
          />

          <v-text-field
            v-model="form.maidenFlight"
            label="First flight"
            placeholder="YYYY-MM-DD"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="onSubmit"
        >
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from "vue";
  import type { AddRocketPayload } from "@/types";

  const props = defineProps<{
    modelValue: boolean;
  }>();

  const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    submit: [payload: AddRocketPayload];
  }>();

  const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null);

  const emptyForm = () => ({
    fullName: "",
    description: "",
    imageUrl: "",
    launchCost: "",
    countryCode: "",
    maidenFlight: "",
  });

  const form = reactive(emptyForm());

  const nameRules = [
    (value: string) => Boolean(value?.trim()) || "Name is required",
  ];

  watch(
    () => props.modelValue,
    (open) => {
      if (open) {
        Object.assign(form, emptyForm());
      }
    },
  );

  function close() {
    emit("update:modelValue", false);
  }

  function optional(value: string): string | null {
    const text = value.trim();
    return text ? text : null;
  }

  async function onSubmit() {
    const result = await formRef.value?.validate();
    if (result && !result.valid) return;

    if (!form.fullName.trim()) return;

    const payload: AddRocketPayload = {
      fullName: form.fullName.trim(),
      description: form.description.trim(),
      imageUrl: optional(form.imageUrl),
      launchCost: optional(form.launchCost),
      countryCode: optional(form.countryCode),
      maidenFlight: optional(form.maidenFlight),
    };

    emit("submit", payload);
    close();
  }
</script>
