<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        rounded="pill"
        size="x-large"
        variant="flat"
        color="transparent"
        class="custom-text text-white text-uppercase font-weight-bold px-10"
      >
        Add a Rocket
      </v-btn>
    </template>

    <v-card rounded="lg">
      <v-card-title class="d-flex align-center pa-6 pb-2">
        <span class="text-h5 font-weight-bold">Add New Rocket</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" density="comfortable" @click="close" />
      </v-card-title>

      <v-card-text class="pa-6 pt-2">
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            v-model="form.name"
            label="Rocket Name"
            variant="outlined"
            :rules="[rules.required]"
            class="mb-2"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            variant="outlined"
            rows="3"
            :rules="[rules.required]"
            class="mb-2"
          />

          <!-- Multiple Image Upload -->
          <div class="mb-4">
            <v-file-input
              label="Upload Rocket Images"
              variant="outlined"
              accept="image/*"
              prepend-icon=""
              prepend-inner-icon="mdi-camera"
              multiple
              :rules="[rules.requiredImages]"
              @update:model-value="onFilesChange"
            />

            <v-row v-if="imagePreviews.length" class="mt-2" dense>
              <v-col
                v-for="(preview, i) in imagePreviews"
                :key="i"
                cols="4"
              >
                <div class="position-relative">
                  <v-img
                    :src="preview"
                    height="100"
                    cover
                    rounded="lg"
                  >
                    <template #error>
                      <v-row class="fill-height bg-grey-darken-3" align="center" justify="center">
                        <v-icon size="24" color="grey">mdi-image-broken</v-icon>
                      </v-row>
                    </template>
                  </v-img>
                  <v-btn
                    icon="mdi-close-circle"
                    size="x-small"
                    color="error"
                    variant="flat"
                    class="position-absolute"
                    style="top: 4px; right: 4px;"
                    @click="removeImage(i)"
                  />
                </div>
              </v-col>
            </v-row>
          </div>

          <v-text-field
            v-model.number="form.cost_per_launch"
            label="Cost Per Launch (USD)"
            variant="outlined"
            type="number"
            prefix="$"
            :rules="[rules.required]"
            class="mb-2"
          />

          <v-text-field
            v-model="form.country"
            label="Country"
            variant="outlined"
            :rules="[rules.required]"
            class="mb-2"
          />

          <v-text-field
            v-model="form.first_flight"
            label="First Flight"
            variant="outlined"
            type="date"
            :rules="[rules.required]"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" :disabled="!valid" @click="submit">
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

const emit = defineEmits<{
  add: [rocket: {
    name: string
    description: string
    flickr_images: string[]
    cost_per_launch: number
    country: string
    first_flight: string
  }]
}>()

const dialog = ref(false)
const valid = ref(false)
const formRef = ref()
const imagePreviews = ref<string[]>([])

const defaultForm = () => ({
  name: '',
  description: '',
  flickr_images: [] as string[],
  cost_per_launch: 0,
  country: '',
  first_flight: '',
})

const form = reactive(defaultForm())

const rules = {
  required: (v: unknown) => {
    if (typeof v === 'number') return true
    return !!v || 'This field is required'
  },
  requiredImages: (v: unknown) => {
    if (Array.isArray(v)) return v.length > 0 || 'At least one image is required'
    return !!v || 'At least one image is required'
  },
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function onFilesChange(files: File | File[] | null) {
  if (!files) {
    imagePreviews.value = []
    form.flickr_images = []
    return
  }

  const fileList = Array.isArray(files) ? files : [files]
  const base64List = await Promise.all(fileList.map(fileToBase64))

  imagePreviews.value = base64List
  form.flickr_images = base64List
}

function removeImage(index: number) {
  imagePreviews.value.splice(index, 1)
  form.flickr_images.splice(index, 1)
}

function close() {
  dialog.value = false
  imagePreviews.value = []
  Object.assign(form, defaultForm())
  formRef.value?.resetValidation()
}

function submit() {
  if (!valid.value) return

  emit('add', {
    name: form.name,
    description: form.description,
    flickr_images: [...form.flickr_images],
    cost_per_launch: form.cost_per_launch,
    country: form.country,
    first_flight: form.first_flight,
  })

  close()
}
</script>

<style scoped>
.custom-text{
  letter-spacing: 0.15em; 
  background: rgba(255, 255, 255, 0.157) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
