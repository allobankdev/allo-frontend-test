<script setup lang="ts">
import { useRocketStore } from "@/stores/rocket";
import { reactive, ref } from "vue";

const dialog = ref(false);
const form = ref();
const store = useRocketStore();

// Validation rules
const rules = {
  required: (value: string) => !!value || "Required field!",
  number: (value: number) => {
    if (!value) return "Required field!";
    return value > 0 || "Must be greater than 0";
  },
  url: (value: string) => {
    if (!value) return true;
    const pattern = /^https?:\/\/.+/;
    return pattern.test(value) || "Must be a valid URL";
  },
};

const rocket = reactive({
  id: "",
  name: "",
  description: "",
  flickr_images: [] as string[],
  cost_per_launch: 0,
  country: "",
  first_flight: "",
  height: { meters: 0, feet: 0 },
  mass: { kg: 0, lb: 0 },
  active: true,
  company: "",
});

const resetForm = () => {
  rocket.id = "";
  rocket.name = "";
  rocket.description = "";
  rocket.flickr_images = [];
  rocket.cost_per_launch = 0;
  rocket.country = "";
  rocket.first_flight = "";
  rocket.height = { meters: 0, feet: 0 };
  rocket.mass = { kg: 0, lb: 0 };
  rocket.active = true;
  rocket.company = "";
  form.value?.resetValidation();
};

const handleSave = async () => {
  const { valid } = await form.value.validate();

  if (!valid) return;
  rocket.id = Date.now().toString();
  rocket.flickr_images = rocket.flickr_images.filter(
    (img) => img.trim() !== ""
  );

  store.addRocket({ ...rocket });

  dialog.value = false;
  resetForm();
};

const handleClose = () => {
  dialog.value = false;
  resetForm();
};

const handleCostInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  // Remove leading zeros
  const cleaned = value.replace(/^0+/, "") || "0";
  rocket.cost_per_launch = parseInt(cleaned) || 0;
};
</script>

<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" max-width="400" persistent>
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" class="text-none"> Add Rocket </v-btn>
      </template>

      <v-card>
        <v-card-title>
          <span class="text-h5">Add Rocket</span>
          <v-container>
            <v-form ref="form">
              <v-text-field
                v-model="rocket.name"
                label="Name"
                required
                :rules="[rules.required]"
                clearable
              />
              <v-text-field
                v-model="rocket.country"
                label="Country"
                required
                :rules="[rules.required]"
                clearable
              />
              <v-text-field
                v-model="rocket.cost_per_launch"
                label="Cost per launch"
                type="number"
                required
                :rules="[rules.number]"
                clearable
                @input="handleCostInput"
              />
              <v-text-field
                v-model="rocket.flickr_images[0]"
                label="Image URL"
                hint="Public URL for rocket image"
                :rules="[rules.url]"
                clearable
              />
              <v-textarea
                v-model="rocket.description"
                label="Description"
                rows="3"
              />
            </v-form>
          </v-container>
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="handleClose"> Cancel </v-btn>
          <v-btn color="primary" @click="handleSave"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
