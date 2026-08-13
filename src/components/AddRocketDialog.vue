<template>
  <v-dialog v-model="model" max-width="720">
    <v-card rounded="lg">
      <v-card-title class="text-h6">Add New Rocket</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                label="Rocket name"
                :rules="[r => !!r || 'Name is required']"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="country"
                label="Country"
                :rules="[r => !!r || 'Country is required']"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="description"
                label="Description"
                auto-grow
                rows="3"
                :rules="[r => !!r || 'Description is required']"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="imageUrl"
                label="Image URL"
                hint="Example: https://..."
                persistent-hint
                :rules="[r => !!r || 'Image URL is required']"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model.number="costPerLaunch"
                label="Cost per launch (USD)"
                type="number"
                :rules="[r => (Number(r) > 0) || 'Must be > 0']"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="firstFlight"
                label="First flight"
                type="date"
                :rules="[r => !!r || 'First flight is required']"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" :disabled="!valid" @click="submit">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { NewRocketInput } from '@/types/rocket'

const model = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  submit: [payload: NewRocketInput]
}>()

const valid = ref(false)
const form = ref<any>(null)

const name = ref('')
const description = ref('')
const country = ref('')
const imageUrl = ref('')
const costPerLaunch = ref<number>(1000000)
const firstFlight = ref('')

function reset () {
  name.value = ''
  description.value = ''
  country.value = ''
  imageUrl.value = ''
  costPerLaunch.value = 1000000
  firstFlight.value = ''
  valid.value = false
  form.value?.resetValidation?.()
}

function close () {
  model.value = false
}

function submit () {
  if (!valid.value) return

  emit('submit', {
    name: name.value.trim(),
    description: description.value.trim(),
    country: country.value.trim(),
    imageUrl: imageUrl.value.trim(),
    cost_per_launch: Number(costPerLaunch.value),
    first_flight: firstFlight.value,
    active: true,
  })

  model.value = false
}

watch(model, (open) => {
  if (!open) reset()
})
</script>
