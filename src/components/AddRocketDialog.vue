<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
        variant="elevated"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">
          mdi-rocket-launch
        </v-icon>
        Add New Rocket
      </v-card-title>

      <v-card-text>
        <v-form
          ref="formRef"
          v-model="valid"
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                label="Rocket Name"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-rocket"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                :rules="[rules.required]"
                variant="outlined"
                rows="3"
                prepend-inner-icon="mdi-text"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country"
                label="Country"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-earth"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                location="bottom"
              >
                <template #activator="{ props: menuProps }">
                  <v-text-field
                    v-model="form.first_flight"
                    label="First Flight Date"
                    :rules="[rules.required, rules.date]"
                    variant="outlined"
                    placeholder="YYYY-MM-DD"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="menuProps"
                  />
                </template>
                <v-date-picker
                  v-model="selectedDate"
                  color="primary"
                  @update:model-value="onDateSelect"
                />
              </v-menu>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model.number="form.cost_per_launch"
                label="Cost per Launch ($)"
                :rules="[rules.required, rules.positive]"
                variant="outlined"
                type="number"
                prepend-inner-icon="mdi-currency-usd"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-switch
                v-model="form.active"
                label="Active"
                color="success"
                inset
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.image_url"
                label="Image URL (optional)"
                variant="outlined"
                prepend-inner-icon="mdi-image"
                placeholder="https://example.com/rocket.jpg"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :disabled="!valid"
          @click="submitForm"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRocketsStore } from '@/stores/rockets'

const emit = defineEmits<{
  (e: 'added'): void
}>()

const rocketsStore = useRocketsStore()

const dialog = ref(false)
const valid = ref(false)
const formRef = ref()
const dateMenu = ref(false)
const selectedDate = ref<Date | null>(null)

const form = reactive({
  name: '',
  description: '',
  country: '',
  first_flight: '',
  cost_per_launch: 0,
  active: true,
  image_url: '',
})

const rules = {
  required: (v: string | number) => !!v || 'This field is required',
  positive: (v: number) => v > 0 || 'Must be a positive number',
  date: (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Use format YYYY-MM-DD',
}

function onDateSelect(date: Date | null) {
  if (date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    form.first_flight = `${year}-${month}-${day}`
  }
  dateMenu.value = false
}

function resetForm() {
  form.name = ''
  form.description = ''
  form.country = ''
  form.first_flight = ''
  form.cost_per_launch = 0
  form.active = true
  form.image_url = ''
  selectedDate.value = null
  formRef.value?.reset()
}

function closeDialog() {
  dialog.value = false
  resetForm()
}

function submitForm() {
  if (!valid.value) return

  rocketsStore.addRocket({
    name: form.name,
    description: form.description,
    country: form.country,
    first_flight: form.first_flight,
    cost_per_launch: form.cost_per_launch,
    active: form.active,
    flickr_images: form.image_url ? [form.image_url] : [],
    height: { meters: 0, feet: 0 },
    diameter: { meters: 0, feet: 0 },
    mass: { kg: 0, lb: 0 },
    stages: 0,
    boosters: 0,
    success_rate_pct: 0,
    company: 'Custom',
    wikipedia: '',
  })

  emit('added')
  closeDialog()
}
</script>
