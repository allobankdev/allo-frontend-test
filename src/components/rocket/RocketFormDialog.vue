<script setup lang="ts">
/**
 * "Add rocket" form. Emits a clean `NewRocketInput`: empty optional fields become `null`
 * so user-added rockets go through the same "missing data" rendering as API rockets.
 */
import { reactive, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import type { VForm } from 'vuetify/components'
import { COUNTRY_OPTIONS } from '@/constants/countries'
import type { NewRocketInput } from '@/types/rocket'

type Rule = (value: string) => true | string

const emit = defineEmits<{
  submit: [input: NewRocketInput]
}>()

const isOpen = defineModel<boolean>({ required: true })

const { smAndDown } = useDisplay()

const formRef = ref<VForm | null>(null)

const emptyForm = () => ({
  name: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  countryCode: null as string | null,
  firstFlight: '',
  isActive: true,
  isReusable: false,
})

const form = reactive(emptyForm())

// Start with a blank form each time the dialog opens.
watch(isOpen, open => {
  if (!open) return
  Object.assign(form, emptyForm())
  formRef.value?.resetValidation()
})

// ── Validation rules ──
const rules = {
  name: [
    (v: string) => v.trim().length > 0 || 'Name is required',
    (v: string) => v.trim().length >= 2 || 'Use at least 2 characters',
    (v: string) => v.trim().length <= 80 || 'Use at most 80 characters',
  ] satisfies Rule[],
  description: [
    (v: string) => v.length <= 1000 || 'Use at most 1000 characters',
  ] satisfies Rule[],
  imageUrl: [
    (v: string) => !v.trim() || isHttpUrl(v.trim()) || 'Enter a valid http(s) URL',
  ] satisfies Rule[],
  launchCost: [
    (v: string) => v === '' || (Number.isFinite(Number(v)) && Number(v) >= 0) || 'Enter a positive number',
  ] satisfies Rule[],
}

function isHttpUrl (value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const orNull = (value: string): string | null => value.trim() || null

async function onSubmit (): Promise<void> {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  emit('submit', {
    name: form.name.trim(),
    description: orNull(form.description),
    imageUrl: orNull(form.imageUrl),
    launchCost: form.launchCost === '' ? null : Number(form.launchCost),
    countryCode: form.countryCode,
    firstFlight: orNull(form.firstFlight),
    isActive: form.isActive,
    isReusable: form.isReusable,
  })
}
</script>

<template>
  <v-dialog
    v-model="isOpen"
    :fullscreen="smAndDown"
    max-width="640"
    scrollable
  >
    <v-card
      color="surface"
      :rounded="smAndDown ? 0 : 'lg'"
    >
      <v-toolbar
        color="surface"
        density="comfortable"
      >
        <v-toolbar-title>
          <h2 class="text-h6">
            Add a rocket
          </h2>
        </v-toolbar-title>
        <v-btn
          icon="mdi-close"
          aria-label="Close"
          variant="text"
          @click="isOpen = false"
        />
      </v-toolbar>

      <v-divider />

      <v-card-text class="pt-6">
        <p class="text-body-2 text-medium-emphasis mb-6">
          The API is read-only, so new rockets are kept in this session only.
          Only the name is required.
        </p>

        <v-form
          id="rocket-form"
          ref="formRef"
          validate-on="blur"
          @submit.prevent="onSubmit"
        >
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                :rules="rules.name"
                label="Name *"
                autocomplete="off"
                counter="80"
                autofocus
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                :rules="rules.description"
                label="Description"
                counter="1000"
                rows="3"
                auto-grow
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.imageUrl"
                :rules="rules.imageUrl"
                label="Image URL"
                placeholder="https://…"
                prepend-inner-icon="mdi-image-outline"
                type="url"
                inputmode="url"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launchCost"
                :rules="rules.launchCost"
                label="Cost per launch"
                prefix="$"
                suffix="USD"
                type="number"
                min="0"
                inputmode="numeric"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.firstFlight"
                label="First flight"
                type="date"
              />
            </v-col>

            <v-col cols="12">
              <v-autocomplete
                v-model="form.countryCode"
                :items="COUNTRY_OPTIONS"
                label="Country"
                prepend-inner-icon="mdi-flag-outline"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              class="d-flex flex-wrap ga-6"
            >
              <v-switch
                v-model="form.isActive"
                label="Active"
              />
              <v-switch
                v-model="form.isReusable"
                label="Reusable"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="isOpen = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          form="rocket-form"
          prepend-icon="mdi-plus"
          type="submit"
          variant="flat"
        >
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
