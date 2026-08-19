<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRocketStore } from '@/stores/rockets'

const open = defineModel<boolean>({ required: true })
const store = useRocketStore()
const form = ref<{ validate: () => Promise<{ valid: boolean }>, resetValidation: () => void }>()
const initial = () => ({ name: '', description: '', imageUrl: '', launchCost: '', countryCode: '', maidenFlight: '' })
const fields = reactive(initial())

const nameRule = (value: string) => Boolean(value.trim()) || 'Rocket name is required.'
const costRule = (value: string) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0) || 'Cost must be zero or greater.'
const imageRule = (value: string) => {
  if (!value) return true
  try { return ['http:', 'https:'].includes(new URL(value).protocol) || 'Use a valid HTTP(S) URL.' } catch { return 'Use a valid HTTP(S) URL.' }
}

function reset () {
  Object.assign(fields, initial())
  form.value?.resetValidation()
}

function cancel () { open.value = false }
async function submit () {
  const result = await form.value?.validate()
  if (!result?.valid) return
  store.addLocalRocket(fields)
  open.value = false
}
watch(open, value => { if (!value) reset() })
</script>

<template>
  <v-dialog
    v-model="open"
    max-width="680"
    scrollable
  >
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-2 text-h5 font-weight-bold">
        Add a local rocket
      </v-card-title>
      <v-card-subtitle class="px-6 pb-2">
        Saved in memory for this running session only.
      </v-card-subtitle>
      <v-form
        ref="form"
        @submit.prevent="submit"
      >
        <v-card-text class="pa-6 form-grid">
          <v-text-field
            v-model="fields.name"
            autofocus
            class="full"
            label="Rocket name *"
            :rules="[nameRule]"
            variant="outlined"
          />
          <v-textarea
            v-model="fields.description"
            class="full"
            label="Description (optional)"
            rows="3"
            variant="outlined"
          />
          <v-text-field
            v-model="fields.imageUrl"
            class="full"
            label="Image URL (optional)"
            :rules="[imageRule]"
            type="url"
            variant="outlined"
          />
          <v-text-field
            v-model="fields.launchCost"
            label="Cost per launch, USD (optional)"
            min="0"
            :rules="[costRule]"
            type="number"
            variant="outlined"
          />
          <v-text-field
            v-model="fields.countryCode"
            label="Country code (optional)"
            maxlength="12"
            variant="outlined"
          />
          <v-text-field
            v-model="fields.maidenFlight"
            class="full"
            label="First flight (optional)"
            type="date"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn @click="cancel">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            variant="flat"
          >
            Add rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
.full { grid-column: 1 / -1; }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .full { grid-column: auto; } }
</style>
