<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-plus"
        color="primary"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5">
        Add New Rocket
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="form.full_name"
            label="Rocket Name"
            variant="outlined"
            required
            class="mb-2"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            variant="outlined"
            rows="3"
            class="mb-2"
          />

          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model.number="form.launch_cost"
            label="Launch Cost"
            type="number"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="form.country_code"
            label="Country"
            variant="outlined"
            maxlength="3"
            class="mb-2"
          />

          <v-text-field
            v-model="form.maiden_flight"
            label="First Flight"
            type="date"
            variant="outlined"
          />

          <div class="d-flex justify-end ga-2 mt-4">
            <v-btn
              variant="text"
              @click="close"
            >
              Cancel
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
            >
              Add Rocket
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Rocket } from '@/types/rocket'

const emit = defineEmits<{
  add: [rocket: Rocket]
}>()

const dialog = ref(false)

const form = ref({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: null as number | null,
  country_code: '',
  maiden_flight: '',
})

function submit() {
  if (!form.value.full_name.trim()) {
    return
  }

  emit('add', {
    id: -Date.now(),
    full_name: form.value.full_name.trim(),
    description: form.value.description.trim() || null,
    image_url: form.value.image_url.trim() || null,
    launch_cost: form.value.launch_cost,
    maiden_flight: form.value.maiden_flight || null,
    manufacturer: form.value.country_code
      ? {
          name: 'Custom',
          country_code: form.value.country_code.toUpperCase(),
        }
      : null,
  })

  form.value = {
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: null,
    country_code: '',
    maiden_flight: '',
  }

  dialog.value = false
}

function close() {
  dialog.value = false
}
</script>
