<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Launcher } from '@/types/ll2'

const emit = defineEmits<{ (e: 'add', rocket: Launcher): void }>()

const open = ref(false)
const valid = ref(false)

const form = reactive({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  maiden_flight: '',
  country: '',
})

const required = (v: string) => !!v?.trim() || 'Required'
const numeric = (v: string) => !v || !Number.isNaN(Number(v)) || 'Must be a number'

function reset() {
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = ''
  form.maiden_flight = ''
  form.country = ''
  valid.value = false
}

function submit() {
  if (!valid.value) return
  const rocket: Launcher = {
    id: Date.now(),
    full_name: form.full_name.trim(),
    description: form.description.trim() || undefined,
    image_url: form.image_url.trim() || undefined,
    launch_cost: form.launch_cost ? Number(form.launch_cost) : undefined,
    maiden_flight: form.maiden_flight.trim() || undefined,
    manufacturer: form.country.trim()
      ? { country_code: form.country.trim().toUpperCase() }
      : undefined,
  }
  emit('add', rocket)
  open.value = false
  reset()
}
</script>

<template>
  <v-dialog
    v-model="open"
    max-width="640"
    @after-leave="reset"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
      >
        Add rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h6">
        Add a new rocket
      </v-card-title>
      <v-card-subtitle>
        The Launch Library 2 API is read-only, so rockets you add are stored
        locally in your browser and persist across reloads.
      </v-card-subtitle>

      <v-card-text>
        <v-form
          v-model="valid"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="form.full_name"
            label="Name"
            :rules="[required]"
            required
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="2"
          />
          <v-text-field
            v-model="form.image_url"
            label="Image URL (optional)"
          />
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="form.launch_cost"
                label="Cost per launch in USD (optional)"
                :rules="[numeric]"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.maiden_flight"
                label="Maiden flight (optional)"
                placeholder="YYYY-MM-DD"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="form.country"
            label="Country code (optional)"
            placeholder="US"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="open = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!valid"
          variant="flat"
          @click="submit"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
