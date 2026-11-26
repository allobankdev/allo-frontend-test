<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { NewRocket } from "@/types/rocket";
import { useRules } from "vuetify/labs/rules";

const rules = {
  ...useRules(),
  url: (err = "Enter a valid URL.") => (v: string) =>
    !v || URL.canParse(v) || err,
};

const open = defineModel<boolean>({ required: true });
const emit = defineEmits<{ save: [rocket: NewRocket] }>();

const emptyForm = () => ({
  full_name: "",
  description: "",
  image_url: "",
  launch_cost: "",
  country: "",
  maiden_flight: "",
});
const form = reactive(emptyForm());
const valid = ref(false);

watch(open, (isOpen) => {
  if (isOpen) Object.assign(form, emptyForm());
});

const save = () => {
  if (!valid.value) return;

  const country = form.country.trim();
  emit("save", {
    full_name: form.full_name.trim(),
    description: form.description.trim() || null,
    image_url: form.image_url.trim() || null,
    launch_cost: form.launch_cost.trim() || null,
    maiden_flight: form.maiden_flight || null,
    manufacturer: country ? { country_code: country } : null,
  });
  open.value = false;
};
</script>

<template>
  <v-dialog v-model="open" max-width="560">
    <v-card title="Add a rocket">
      <v-form v-model="valid" @submit.prevent="save">
        <v-card-text>
          <v-text-field
            v-model="form.full_name"
            label="Rocket name *"
            :rules="[rules.required()]"
            autofocus
          />
          <v-textarea v-model="form.description" label="Description" rows="3" />
          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            type="url"
            :rules="[rules.url()]"
          />
          <v-text-field
            v-model="form.launch_cost"
            label="Cost per launch (USD)"
            type="number"
            min="0"
            :rules="[rules.integer('Cost must be 0 or greater.')]"
          />
          <v-text-field v-model="form.country" label="Country" />
          <v-text-field
            v-model="form.maiden_flight"
            label="First flight"
            type="date"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="open = false"> Cancel </v-btn>
          <v-btn type="submit" color="primary" :disabled="!valid"> Save </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
