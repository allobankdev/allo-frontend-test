<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field
      v-model="localRocket.name"
      label="Name"
      required
    />
    <v-textarea
      v-model="localRocket.description"
      label="Description"
      required
    />
    <v-text-field
      v-model="localRocket.country"
      label="Country"
      required
    />
    <v-text-field
      v-model="localRocket.company"
      label="Company"
      required
    />
    <v-text-field
      v-model="localRocket.first_flight"
      label="First Flight"
      type="date"
      required
    />
    <v-text-field
      v-model.number="localRocket.cost_per_launch"
      label="Cost per Launch ($)"
      type="number"
      required
    />
    <v-text-field
      v-model.number="localRocket.success_rate_pct"
      label="Success Rate (%)"
      type="number"
      min="0"
      max="100"
      required
    />
    <v-text-field
      v-model="localRocket.flickr_images[0]"
      label="Image URL"
      required
      @update:model-value="updateFlickrImages"
    />
    <v-text-field
      v-model="localRocket.wikipedia"
      label="Wikipedia URL"
      required
    />
    <v-switch
      v-model="localRocket.active"
      label="Active"
      color="primary"
    />

    <v-card-actions class="justify-end">
      <slot name="actions">
        <!-- default actions -->
        <v-btn
          type="submit"
          color="primary"
        >
          Save
        </v-btn>
      </slot>
    </v-card-actions>
  </v-form>
</template>

<script setup lang="ts">
import type { Rocket } from "@/types/rocket";
import { ref, watch, defineEmits, defineProps } from "vue";

const props = defineProps<{
  modelValue: Rocket;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Rocket): void;
  (e: "submit"): void;
}>();

const localRocket = ref<Rocket>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (val) => {
    localRocket.value = { ...val };
  },
  { deep: true }
);

const handleSubmit = () => {
  emit("update:modelValue", localRocket.value);
  emit("submit");
};

const updateFlickrImages = (value: string) => {
  localRocket.value.flickr_images = [value];
  emit('update:modelValue', localRocket.value);
};
</script>