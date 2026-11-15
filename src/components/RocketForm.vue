<script setup lang="ts">
import { ref } from 'vue';
import type { Rocket } from '@/types/rocket';

const emit = defineEmits<{
  save: [rocket: Rocket];
}>();

const dialog = ref(false);
const name = ref('');
const description = ref('');
const imageUrl = ref('');
const launchCost = ref('');
const country = ref('');
const maidenFlight = ref('');


function submit() {
  if (!name.value.trim()) return;

  const cost = launchCost.value.trim()
    ? Number(launchCost.value)
    : null;

  if (cost !== null && (!Number.isFinite(cost) || cost < 0)) {
    return;
  }

  const rocket: Rocket = {
    id: `local-${Date.now()}`,
    full_name: name.value.trim(),
    description: description.value.trim() || null,
    image_url: imageUrl.value.trim() || null,
    launch_cost: cost,
    maiden_flight: maidenFlight.value || null,
    manufacturer: {
      country_code: country.value.trim() || null,
    },
  };

  emit('save', rocket);
  dialog.value = false;

  name.value = '';
  description.value = '';
  imageUrl.value = '';
  launchCost.value = '';
  country.value = '';
  maidenFlight.value = '';
}

</script>

<template>
  <div>
    <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
      Add Rocket
    </v-btn>

    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="pa-5">
          Add New Rocket
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="submit">
            <v-text-field
              v-model="name"
              label="Rocket Name"
              variant="outlined"
              required
            />

            <v-textarea
              v-model="description"
              label="Description"
              variant="outlined"
            />

            <v-text-field
              v-model="imageUrl"
              label="Image URL"
              variant="outlined"
            />

            <v-text-field
              v-model="launchCost"
              label="Cost per Launch"
              type="number"
              min="0"
              step="any"
              variant="outlined"
            />

            <v-text-field
              v-model="country"
              label="Country Code"
              variant="outlined"
            />

            <v-text-field
              v-model="maidenFlight"
              label="First Flight"
              type="date"
              variant="outlined"
            />

            <div class="d-flex justify-end ga-2">
              <v-btn variant="text" @click="dialog = false">
                Cancel
              </v-btn>

              <v-btn
                color="primary"
                type="submit"
                :disabled="!name.trim()"
              >
                Save Rocket
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
