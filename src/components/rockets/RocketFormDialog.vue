<template>
  <v-dialog
    v-model="isOpen"
    max-width="640"
    persistent
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between py-4">
        <span>Add a new rocket</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="close"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-4">
        <p class="text-body-2 text-medium-emphasis mb-4">
          The rocket API is read-only, so this rocket will only appear here in your browser.
        </p>

        <v-form
          ref="formRef"
          v-model="isFormValid"
          @submit.prevent="handleSubmit"
        >
          <v-text-field
            v-model="form.fullName"
            autofocus
            class="mb-1"
            label="Rocket name *"
            :rules="[rules.required]"
            variant="outlined"
          />

          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-combobox
                v-model="form.family"
                :items="store.families"
                label="Family"
                variant="outlined"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.manufacturerName"
                label="Manufacturer"
                placeholder="e.g. SpaceX"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
            variant="outlined"
          />

          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            placeholder="https://..."
            :rules="[rules.optionalUrl]"
            variant="outlined"
          />

          <v-row dense>
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
                v-model="form.countryCode"
                label="Country code"
                placeholder="e.g. USA"
                variant="outlined"
              />
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
              :model-value="formatNumber(form.launchCost)"
              label="Cost per launch (USD)"
              inputmode="numeric"
              variant="outlined"
              @update:model-value="handleLaunchCostInput"
            />

            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
                v-model="form.maidenFlight"
                label="First flight"
                type="date"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <div class="d-flex ga-6">
            <v-switch
              v-model="form.active"
              color="primary"
              hide-details
              label="Active"
            />
            <v-switch
              v-model="form.reusable"
              color="primary"
              hide-details
              label="Reusable"
            />
          </div>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-rocket-launch"
          variant="flat"
          @click="handleSubmit"
        >
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue'
  import { useRocketStore } from '@/stores/rockets'
  import type { Rocket } from '@/types/rocket'

  const isOpen = defineModel<boolean>({ required: true })

  const emit = defineEmits<{
    added: [rocket: Rocket]
  }>()

  const store = useRocketStore()

  const formRef = ref()
  const isFormValid = ref(false)

  function defaultForm () {
    return {
      fullName: '',
      family: '' as string,
      manufacturerName: '',
      countryCode: '',
      description: '',
      imageUrl: '',
      launchCost: '',
      maidenFlight: '',
      active: true,
      reusable: false,
    }
  }

  const form = reactive(defaultForm())

  const rules = {
    required: (v: string) => !!v?.trim() || 'This field is required.',
    optionalUrl: (v: string) => {
      if (!v) return true
      try {

        new URL(v)
        return true
      } catch {
        return 'Enter a valid URL (including https://).'
      }
    },
    optionalNonNegative: (v: string) => {
      if (v === '' || v === null || v === undefined) return true
      return Number(v) >= 0 || 'Cost cannot be negative.'
    },


  }

  function close () {
    isOpen.value = false
  }

  function formatNumber (value: string | number) {
  if (value === '' || value === null || value === undefined) return ''

  const number = Number(String(value).replace(/,/g, ''))

  if (Number.isNaN(number)) return ''

  return number.toLocaleString('en-US')
}

function handleLaunchCostInput (value: string) {
  // Hapus koma dan semua karakter selain angka
  const rawValue = value.replace(/,/g, '').replace(/\D/g, '')

  form.launchCost = rawValue
}


  async function handleSubmit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    const newRocket = store.addCustomRocket({
      name: form.fullName.trim(),
      fullName: form.fullName.trim(),
      description: form.description.trim() || null,
      family: form.family.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      launchCost: form.launchCost === '' ? null : Number(form.launchCost),
      maidenFlight: form.maidenFlight || null,
      manufacturer: form.manufacturerName.trim()
        ? {
            id: -1,
            name: form.manufacturerName.trim(),
            countryCode: form.countryCode.trim() || null,
            type: null,
          }
        : null,
      active: form.active,
      reusable: form.reusable,
    })

    emit('added', newRocket)
    close()
  }

  // Reset the form every time the dialog opens, so stale input from a
  // previous "Add rocket" doesn't linger for the next one.
  watch(isOpen, open => {
    if (open) {
      Object.assign(form, defaultForm())
      formRef.value?.resetValidation()
    }
  })
</script>
