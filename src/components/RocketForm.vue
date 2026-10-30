
<script setup lang="ts">
import { ref } from 'vue'
import { useRocketStore } from '../stores/rockets'
import type { Rocket } from '../types/rocket'

const rocketStore = useRocketStore()

const dialog = ref(false)
const form = ref()
const name = ref('')
const description = ref('')
const imageUrl = ref('')
const launchCost = ref('')
const country = ref('')
const firstFlight = ref('')

const requiredRule = (value: string) =>
  !!value?.trim() || 'Rocket name is required'

const costRule = (value: string) =>
  !value || (Number.isFinite(Number(value)) && Number(value) >= 0)
    || 'Enter a valid non-negative cost'

function resetForm() {
  name.value = ''
  description.value = ''
  imageUrl.value = ''
  launchCost.value = ''
  country.value = ''
  firstFlight.value = ''
}

function closeForm() {
  dialog.value = false
  resetForm()
}

async function saveRocket() {
  const result = await form.value?.validate()

  if (!result?.valid) return

  const rocket: Rocket = {
    id: `local-${crypto.randomUUID()}`,
    full_name: name.value.trim(),
    description: description.value.trim() || null,
    image_url: imageUrl.value.trim() || null,
    launch_cost: launchCost.value.trim() || null,
    maiden_flight: firstFlight.value || null,
    manufacturer: {
      country_code: country.value.trim().toUpperCase() || null,
    },
  }

  rocketStore.addRocket(rocket)
  closeForm()
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="600">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="primary"
        prepend-icon="mdi-plus"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card rounded="lg">
      <v-card-title class="pa-5">
        Add New Rocket
      </v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="saveRocket">
          <v-text-field
            v-model="name"
            label="Rocket Name"
            :rules="[requiredRule]"
            variant="outlined"
            class="mb-2"
          />

          <v-textarea
            v-model="description"
            label="Description"
            variant="outlined"
            rows="3"
            class="mb-2"
          />

          <v-text-field
            v-model="imageUrl"
            label="Image URL"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="launchCost"
            label="Launch Cost (USD)"
            type="number"
            min="0"
            :rules="[costRule]"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="country"
            label="Country Code (e.g. USA)"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="firstFlight"
            label="First Flight"
            type="date"
            variant="outlined"
          />

          <v-card-actions class="px-0">
            <v-spacer />

            <v-btn
              variant="text"
              @click="closeForm"
            >
              Cancel
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
            >
              Save Rocket
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
