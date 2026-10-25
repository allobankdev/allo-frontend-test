<script setup lang="ts">
import { ref } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'

const dialog = ref(false)
const store = useRocketStore()

const form = ref({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: null as number | null,
  country_code: '',
  maiden_flight: ''
})

const handleSubmit = () => {
  if (!form.value.full_name) return

  store.addRocket({
    full_name: form.value.full_name,
    description: form.value.description || 'No description provided.',
    image_url: form.value.image_url || null,
    launch_cost: form.value.launch_cost ? Number(form.value.launch_cost) : null,
    maiden_flight: form.value.maiden_flight || null,
    manufacturer: {
      country_code: form.value.country_code || 'N/A'
    }
  })

  // Reset form & close dialog
  form.value = {
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: null,
    country_code: '',
    maiden_flight: ''
  }
  dialog.value = false
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ props }">
      <v-btn color="primary" v-bind="props" prepend-icon="mdi-plus">
        Add New Rocket
      </v-btn>
    </template>

    <v-card title="Add New Rocket">
      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.full_name"
            label="Rocket Name *"
            required
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
          />
          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            placeholder="https://example.com/rocket.jpg"
          />
          <v-text-field
            v-model="form.launch_cost"
            label="Cost per Launch ($)"
            type="number"
          />
          <v-text-field
            v-model="form.country_code"
            label="Country Code (e.g. USA)"
          />
          <v-text-field
            v-model="form.maiden_flight"
            label="First Flight Date"
            type="date"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="grey-darken-1" variant="text" @click="dialog = false">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="elevated" @click="handleSubmit">
          Save Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
