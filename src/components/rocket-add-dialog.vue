<script setup lang="ts">
import { ref, watch } from "vue";

import type { Rocket } from "@/services/rocket.service";

const props = defineProps<{
  modelValue: boolean;
  initialRocket?: Rocket;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", payload: Rocket): void;
}>();

const emptyRocket = (): Rocket => ({
  id: "",
  name: "",
  description: "",
  country: "",
  cost_per_launch: 0,
  first_flight: "",
  flickr_images: [""],

  height: { meters: 0, feet: 0 },
  diameter: { meters: 0, feet: 0 },
  mass: { kg: 0, lb: 0 },

  first_stage: {
    thrust_sea_level: { kN: 0, lbf: 0 },
    thrust_vacuum: { kN: 0, lbf: 0 },
    reusable: false,
    engines: 0,
    fuel_amount_tons: 0,
    burn_time_sec: 0,
  },

  second_stage: {
    thrust: { kN: 0, lbf: 0 },
    payloads: {
      composite_fairing: {
        height: { meters: 0, feet: 0 },
        diameter: { meters: 0, feet: 0 },
      },
      option_1: "",
    },
    reusable: false,
    engines: 0,
    fuel_amount_tons: 0,
    burn_time_sec: 0,
  },

  engines: {
    isp: { sea_level: 0, vacuum: 0 },
    thrust_sea_level: { kN: 0, lbf: 0 },
    thrust_vacuum: { kN: 0, lbf: 0 },
    number: 0,
    type: "",
    version: "",
    layout: "",
    engine_loss_max: 0,
    propellant_1: "",
    propellant_2: "",
    thrust_to_weight: 0,
  },

  landing_legs: { number: 0, material: "" },
  payload_weights: [],
  type: "",
  active: false,
  stages: 0,
  boosters: 0,
  success_rate_pct: 0,
  company: "",
  wikipedia: "",
});

const form = ref<Rocket>(emptyRocket());

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      form.value = props.initialRocket
        ? JSON.parse(JSON.stringify(props.initialRocket))
        : emptyRocket();
    }
  },
  { immediate: true }
);

const addImage = () => {
  form.value.flickr_images.push("");
};

const removeImage = (index: number) => {
  form.value.flickr_images.splice(index, 1);
};

const close = () => emit("update:modelValue", false);

const save = () => {
  form.value.flickr_images =
    form.value.flickr_images.filter(Boolean);

  emit("save", JSON.parse(JSON.stringify(form.value)));
  close();
};
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>
        {{ initialRocket ? "Edit Rocket" : "Add New Rocket" }}
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="form.name"
          label="Name"
        />
        <v-textarea
          v-model="form.description"
          label="Description"
        />
        <v-text-field
          v-model="form.country"
          label="Country"
        />

        <v-text-field
          v-model.number="form.cost_per_launch"
          label="Cost per Launch"
          type="number"
        />

        <v-text-field
          v-model="form.first_flight"
          label="First Flight"
          type="date"
        />

        <div class="space-y-2">
          <div
            v-for="(img, index) in form.flickr_images"
            :key="index"
            class="flex gap-2 items-center"
          >
            <v-text-field
              v-model="form.flickr_images[index]"
              label="Image URL"
              class="flex-1"
              hide-details
            />

            <v-btn
              v-if="form.flickr_images.length > 1"
              icon="mdi-delete"
              variant="text"
              color="error"
              @click="removeImage(index)"
            />
          </div>

          <v-btn
            variant="outlined"
            color="primary"
            @click="addImage"
          >
            + Add Image
          </v-btn>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="!form.name || !form.description"
          @click="save"
        >
          Save
        </v-btn>
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
