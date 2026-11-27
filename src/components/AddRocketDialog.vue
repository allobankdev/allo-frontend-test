<template>
  <v-dialog
    max-width="560"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6">Add New Rocket</span>
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="closeDialog"
        />
      </v-card-title>

      <v-divider />

      <v-form
        ref="formRef"
        @submit.prevent="handleSubmit"
      >
        <v-card-text class="pa-4">
          <v-text-field
            v-model="form.full_name"
            class="mb-2"
            label="Rocket Name *"
            placeholder="e.g. Starship V4"
            :rules="[rules.required]"
            variant="outlined"
          />

          <v-textarea
            v-model="form.description"
            class="mb-2"
            label="Description"
            placeholder="Describe this rocket..."
            rows="3"
            variant="outlined"
          />

          <div class="mb-3">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-body-2 text-medium-emphasis">Rocket Image (optional)</span>
              <v-btn-toggle
                v-model="imageSource"
                color="primary"
                density="compact"
                mandatory
                variant="outlined"
              >
                <v-btn
                  size="small"
                  value="file"
                >
                  Upload
                </v-btn>
                <v-btn
                  size="small"
                  value="url"
                >
                  URL
                </v-btn>
              </v-btn-toggle>
            </div>

            <v-file-input
              v-if="imageSource === 'file'"
              v-model="selectedFile"
              accept="image/*"
              clearable
              label="Choose image from gallery / device"
              prepend-icon=""
              prepend-inner-icon="mdi-image-plus"
              show-size
              variant="outlined"
              @update:model-value="handleFileChange"
            />

            <v-text-field
              v-else
              v-model="form.image_url"
              label="Image URL (optional)"
              placeholder="https://example.com/rocket.jpg"
              prepend-inner-icon="mdi-link"
              variant="outlined"
            />

            <v-img
              v-if="activeImageUrl"
              alt="Rocket preview"
              class="rounded-lg mb-2 bg-surface-variant"
              cover
              height="140"
              :src="activeImageUrl"
            />
          </div>

          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Cost per Launch in USD (optional)"
                placeholder="e.g. 50000000"
                :rules="[rules.numericOptional]"
                type="number"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                label="Country Code (optional)"
                placeholder="e.g. USA"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.maiden_flight"
                label="First Flight (optional)"
                type="date"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-combobox
                v-model="form.family"
                clearable
                :items="families"
                label="Family (optional)"
                placeholder="Select or type family"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-switch
            v-model="form.active"
            color="primary"
            hide-details
            label="Active Rocket"
          />
        </v-card-text>

        <v-divider />

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
            type="submit"
            variant="flat"
          >
            Save Rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue'
  import type { NewRocketPayload } from '@/types/rocket'

  withDefaults(defineProps<{
    modelValue: boolean
    families?: string[]
  }>(), {
    families: () => ['Falcon', 'Starship'],
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    submit: [payload: NewRocketPayload]
  }>()

  const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
  const imageSource = ref<'file' | 'url'>('file')
  const selectedFile = ref<File | File[] | null>(null)
  const uploadedImageDataUrl = ref<string | null>(null)

  const form = reactive({
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    country_code: 'USA',
    maiden_flight: '',
    family: 'Starship',
    active: true,
  })

  const activeImageUrl = computed(() => {
    if (imageSource.value === 'file') {
      return uploadedImageDataUrl.value
    }
    return form.image_url.trim() || null
  })

  const rules = {
    required: (v: string) => Boolean(v?.trim()) || 'Rocket name is required',
    numericOptional: (v: string) => {
      if (!v) return true
      return (!Number.isNaN(Number(v)) && Number(v) >= 0) || 'Must be a valid positive number'
    },
  }

  function handleFileChange (files: File | File[] | null | undefined) {
    const file = Array.isArray(files) ? files[0] : files
    if (!file) {
      uploadedImageDataUrl.value = null
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      uploadedImageDataUrl.value = typeof reader.result === 'string' ? reader.result : null
    }
    reader.readAsDataURL(file)
  }

  function resetForm () {
    form.full_name = ''
    form.description = ''
    form.image_url = ''
    form.launch_cost = ''
    form.country_code = 'USA'
    form.maiden_flight = ''
    form.family = 'Starship'
    form.active = true
    imageSource.value = 'file'
    selectedFile.value = null
    uploadedImageDataUrl.value = null
  }

  function closeDialog () {
    emit('update:modelValue', false)
  }

  async function handleSubmit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    emit('submit', {
      full_name: form.full_name,
      description: form.description,
      image_url: activeImageUrl.value,
      launch_cost: form.launch_cost || null,
      country_code: form.country_code || null,
      maiden_flight: form.maiden_flight || null,
      family: form.family || null,
      active: form.active,
    })

    resetForm()
    closeDialog()
  }
</script>