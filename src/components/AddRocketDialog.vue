<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <template #activator="{ props }">
      <v-btn color="primary" v-bind="props" size="large">
        <v-icon start> mdi-plus </v-icon>
        Add Rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="bg-primary text-white">
        <span class="text-h5">Add New Rocket</span>
      </v-card-title>

      <v-card-text class="pt-6">
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            v-model="form.name"
            label="Rocket Name *"
            :rules="[rules.required]"
            variant="outlined"
            prepend-inner-icon="mdi-rocket"
            required />

          <v-textarea
            v-model="form.description"
            label="Description *"
            :rules="[rules.required]"
            variant="outlined"
            rows="3"
            prepend-inner-icon="mdi-text"
            required />

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.country"
                label="Country *"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-flag"
                required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.company"
                label="Company *"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-office-building"
                required />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.image"
            label="Image URL *"
            :rules="[rules.required, rules.url]"
            variant="outlined"
            prepend-inner-icon="mdi-image"
            required />

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.costPerLaunch"
                label="Cost per Launch ($) *"
                type="number"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-currency-usd"
                required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.firstFlight"
                label="First Flight Date *"
                type="date"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-calendar"
                required />
            </v-col>
          </v-row>

          <v-switch v-model="form.active" label="Active Status" color="primary" inset />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="closeDialog"> Cancel </v-btn>
        <v-btn color="primary" :disabled="!valid" @click="handleSubmit">
          <v-icon start> mdi-check </v-icon>
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRocketStore } from '@/stores';

const store = useRocketStore();
const dialog = ref(false);
const valid = ref(false);
const formRef = ref();

const form = ref({
  name: '',
  description: '',
  country: '',
  company: 'Custom',
  image: '',
  costPerLaunch: 0,
  firstFlight: new Date().toISOString().split('T')[0],
  active: true,
});

const rules = {
  required: (v: unknown) => !!v || 'This field is required',
  url: (v: string) => {
    const pattern = /^https?:\/\/.+/;
    return pattern.test(v) || 'Must be a valid URL (http:// or https://)';
  },
};

const handleSubmit = async () => {
  const { valid: isValid } = await formRef.value.validate();

  if (isValid) {
    store.addRocket({
      id: crypto.randomUUID(),
      name: form.value.name,
      description: form.value.description,
      type: 'Custom',
      active: form.value.active,
      stages: 2,
      boosters: 0,
      cost_per_launch: form.value.costPerLaunch,
      success_rate_pct: 0,
      first_flight: form.value.firstFlight,
      country: form.value.country,
      company: form.value.company,
      height: { meters: 0, feet: 0 },
      diameter: { meters: 0, feet: 0 },
      mass: { kg: 0, lb: 0 },
      flickr_images: [form.value.image],
      wikipedia: '',
      payload_weights: [],
    });

    closeDialog();
  }
};

const closeDialog = () => {
  formRef.value?.reset();
  dialog.value = false;
};
</script>
