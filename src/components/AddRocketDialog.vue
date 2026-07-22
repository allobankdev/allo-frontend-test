<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
  >
    <template #activator="{ props }">
      <v-btn
        color="primary"
        v-bind="props"
        prepend-icon="mdi-plus"
      >
        Add Rocket
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add New Rocket</span>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="isValid"
          @submit.prevent="submit"
        >
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="rocket.name"
                  label="Rocket Name*"
                  :rules="[v => !!v || 'Name is required']"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="rocket.flickr_images[0]"
                  label="Image URL*"
                  :rules="[v => !!v || 'Image URL is required']"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model.number="rocket.cost_per_launch"
                  label="Cost Per Launch ($)*"
                  type="number"
                  :rules="[v => !!v || 'Cost is required', v => v > 0 || 'Cost must be positive']"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="rocket.country"
                  label="Country*"
                  :rules="[v => !!v || 'Country is required']"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="rocket.first_flight"
                  label="First Flight (YYYY-MM-DD)*"
                  type="date"
                  :rules="[v => !!v || 'First Flight is required']"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="rocket.description"
                  label="Description*"
                  :rules="[v => !!v || 'Description is required']"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="dialog = false"
        >
          Close
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          :disabled="!isValid"
          @click="submit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import type { Rocket } from '@/types/rocket'
import type { VForm } from 'vuetify/components'

const dialog = ref(false)
const isValid = ref(false)
const form = ref<VForm | null>(null)
const store = useRocketStore()

const initialRocketState = (): Partial<Rocket> => ({
  name: '',
  description: '',
  flickr_images: [''],
  cost_per_launch: 0,
  country: '',
  first_flight: ''
})

const rocket = reactive<Partial<Rocket>>(initialRocketState())

const submit = () => {
  if (!isValid.value) return

  const newRocket: Rocket = {
    ...rocket,
    id: `local-${Date.now()}`
  } as Rocket

  store.addLocalRocket(newRocket)

  // Reset form and close
  Object.assign(rocket, initialRocketState())
  if (form.value) form.value.resetValidation()
  dialog.value = false
}
</script>
