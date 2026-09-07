<template>
  <div>
    <v-btn
      color="primary"
      prepend-icon="mdi-plus"
      elevation="2"
      @click="dialog = true"
    >
      Add Rocket
    </v-btn>

    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-primary text-white d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon icon="mdi-rocket-launch" class="mr-2"></v-icon>
            <span class="text-h6 font-weight-bold">Add Custom SpaceX Rocket</span>
          </div>
          <v-btn icon="mdi-close" variant="text" color="white" density="compact" @click="closeDialog"></v-btn>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.name"
                  label="Rocket Short Name *"
                  placeholder="e.g. Starship B7"
                  :rules="[v => !!v || 'Rocket name is required']"
                  variant="outlined"
                  density="compact"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.full_name"
                  label="Full Name"
                  placeholder="e.g. SpaceX Starship Super Heavy"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
                  label="Description"
                  placeholder="Provide a brief description of the rocket design and capabilities..."
                  variant="outlined"
                  density="compact"
                  rows="3"
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.image_url"
                  label="Image URL"
                  placeholder="https://example.com/rocket.jpg"
                  prepend-inner-icon="mdi-image"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="form.launch_cost"
                  label="Cost Per Launch ($ USD)"
                  placeholder="e.g. 67000000"
                  type="number"
                  prefix="$"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.country_code"
                  label="Country Code"
                  placeholder="e.g. USA"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.maiden_flight"
                  label="First Flight Date"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" class="d-flex align-center justify-space-around">
                <v-switch
                  v-model="form.active"
                  label="Active"
                  color="success"
                  hide-details
                  density="compact"
                ></v-switch>

                <v-switch
                  v-model="form.reusable"
                  label="Reusable"
                  color="info"
                  hide-details
                  density="compact"
                ></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4 justify-end">
          <v-btn color="grey-darken-1" variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            prepend-icon="mdi-check"
            :disabled="!isFormValid"
            @click="handleSubmit"
          >
            Save Rocket
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import type { CreateRocketDto } from '@/types/rocket'

const dialog = ref(false)
const formRef = ref<any>(null)
const isFormValid = ref(false)

const store = useRocketStore()
const router = useRouter()

const initialFormState = (): CreateRocketDto => ({
  name: '',
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: undefined,
  country_code: 'USA',
  maiden_flight: '',
  active: true,
  reusable: true,
})

const form = reactive<CreateRocketDto>(initialFormState())

function closeDialog() {
  dialog.value = false
  Object.assign(form, initialFormState())
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

function handleSubmit() {
  if (!form.name.trim()) return

  const created = store.addRocket({ ...form })
  closeDialog()
  // Navigate to newly created rocket detail screen
  router.push(`/rockets/${created.id}`)
}
</script>
