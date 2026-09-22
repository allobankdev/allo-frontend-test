<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
        variant="elevated"
        rounded="lg"
        size="large"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card rounded="xl">
      <v-card-title class="text-h5 font-weight-bold pa-6 pb-2">
        <v-icon
          icon="mdi-rocket-launch"
          class="mr-2"
          color="primary"
        />
        Insert new rocket criteria
      </v-card-title>

      <v-card-text class="px-6">
        <v-form
          ref="formRef"
          v-model="formValid"
          @submit.prevent="submitForm"
        >
          <v-text-field
            v-model="form.full_name"
            label="Rocket Name"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-rocket"
            variant="outlined"
            rounded="lg"
            class="mb-2"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-text"
            variant="outlined"
            rounded="lg"
            rows="3"
            class="mb-2"
          />

          <div class="mb-3">
            <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
              Rocket Image Source
            </div>
            <v-btn-toggle
              v-model="imageSource"
              mandatory
              color="primary"
              variant="outlined"
              density="compact"
              rounded="lg"
              class="mb-3"
            >
              <v-btn
                value="url"
                prepend-icon="mdi-link"
                size="small"
              >
                URL Link
              </v-btn>
              <v-btn
                value="local"
                prepend-icon="mdi-folder-image"
                size="small"
              >
                Local File
              </v-btn>
            </v-btn-toggle>

            <v-text-field
              v-if="imageSource === 'url'"
              v-model="form.image_url"
              label="Image URL (optional)"
              placeholder="https://example.com/rocket.jpg"
              prepend-inner-icon="mdi-image"
              variant="outlined"
              rounded="lg"
              clearable
            />

            <v-file-input
              v-else
              v-model="localFile"
              label="Choose image file from local"
              accept="image/*"
              prepend-icon=""
              prepend-inner-icon="mdi-upload"
              variant="outlined"
              rounded="lg"
              show-size
              clearable
              @update:model-value="onFileSelected"
            />

            <div
              v-if="form.image_url"
              class="mt-2 text-center"
            >
              <v-img
                :src="form.image_url"
                max-height="140"
                contain
                rounded="lg"
                class="bg-grey-darken-4 pa-2"
              />
            </div>
          </div>

          <v-text-field
            :model-value="form.launch_cost"
            label="Launch Cost (optional)"
            placeholder="e.g. 1,000,000"
            :rules="[rules.numberOnly]"
            prepend-inner-icon="mdi-currency-usd"
            variant="outlined"
            rounded="lg"
            class="mb-2"
            clearable
            @update:model-value="onLaunchCostInput"
          />

          <v-text-field
            v-model="form.maiden_flight"
            label="First Flight Date (optional)"
            placeholder="YYYY-MM-DD"
            prepend-inner-icon="mdi-calendar"
            variant="outlined"
            type="date"
            rounded="lg"
            class="mb-2"
            clearable
          />

          <v-text-field
            v-model="form.country_code"
            label="Country Code (optional)"
            placeholder="e.g. USA"
            prepend-inner-icon="mdi-earth"
            variant="outlined"
            rounded="lg"
            clearable
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer />
        <v-btn
          variant="text"
          rounded="lg"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          rounded="lg"
          :disabled="!formValid"
          @click="submitForm"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import type { Rocket } from '@/types/rocket'

const emit = defineEmits<{
  add: [rocket: Omit<Rocket, 'id'>]
}>()

const dialog = ref(false)
const formValid = ref(false)
const formRef = ref<InstanceType<typeof import('vuetify/components').VForm> | null>(null)

const imageSource = ref<'url' | 'local'>('url')
const localFile = ref<File[] | File | null>(null)

const form = reactive({
  full_name: '',
  description: '',
  image_url: '' as string | null,
  launch_cost: '' as string | null,
  maiden_flight: '' as string | null,
  country_code: '' as string | null,
})

const rules = {
  required: (v: string | null) => !!(v || '').trim() || 'This field is required',
  numberOnly: (v: string | null) => !(v || '').trim() || /^\d[\d,]*$/.test((v || '').trim()) || 'Numbers only',
}

watch(dialog, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})

function onLaunchCostInput(val: string | null) {
  if (!val) {
    form.launch_cost = ''
    return
  }
  const digits = val.replace(/\D/g, '')
  if (!digits) {
    form.launch_cost = ''
    return
  }
  form.launch_cost = Number(digits).toLocaleString('en-US')
}

function onFileSelected(fileOrFiles: File[] | File | null) {
  const file = Array.isArray(fileOrFiles) ? fileOrFiles[0] : fileOrFiles
  if (!file) {
    form.image_url = ''
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    form.image_url = (e.target?.result as string) || ''
  }
  reader.readAsDataURL(file)
}

function submitForm() {
  if (!formValid.value) return

  const fullName = (form.full_name || '').trim()
  const description = (form.description || '').trim()
  const imageUrl = (form.image_url || '').trim()
  const launchCost = (form.launch_cost || '').trim()
  const maidenFlight = (form.maiden_flight || '').trim()
  const countryCode = (form.country_code || '').trim()

  emit('add', {
    full_name: fullName,
    description: description,
    image_url: imageUrl || null,
    launch_cost: launchCost || null,
    maiden_flight: maidenFlight || null,
    manufacturer: countryCode
      ? {
          id: -1,
          name: 'Custom',
          country_code: countryCode,
          type: null,
        }
      : null,
  })

  dialog.value = false
}

function closeDialog() {
  dialog.value = false
}

function resetForm() {
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = ''
  form.maiden_flight = ''
  form.country_code = ''
  imageSource.value = 'url'
  localFile.value = null
  formRef.value?.reset()
}
</script>
