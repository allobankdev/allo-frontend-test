<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'

import { useRocketStore } from '@/stores/rocketStore'
import type { Rocket } from '@/types/rocket'

import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import UiState from '@/components/UiState.vue'

/* ----------------------------------
 * Store
 * ---------------------------------- */
const store = useRocketStore()
const { filteredRockets, loading, error, filter } = storeToRefs(store)

/* ----------------------------------
 * Dialog & Form State
 * ---------------------------------- */
const dialog = ref(false)
const formRef = ref()

const imagePreview = ref<string | null>(null)

const form = reactive({
  name: '',
  description: '',
})

/* ----------------------------------
 * Lifecycle
 * ---------------------------------- */
onMounted(() => {
  store.fetchRockets()
})

/* ----------------------------------
 * Methods
 * ---------------------------------- */
const openDialog = () => {
  resetForm()
  dialog.value = true
}

const resetForm = () => {
  form.name = ''
  form.description = ''
  imagePreview.value = null
}

/* Image upload (Add Rocket only) */
const onImageUpload = (files: File | File[] | null) => {
  if (!files) return

  const file = Array.isArray(files) ? files[0] : files
  const reader = new FileReader()

  reader.onload = () => {
    imagePreview.value = reader.result as string
  }

  reader.readAsDataURL(file)
}

/* Submit new rocket */
const submitRocket = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const newRocket: Rocket = {
    id: Date.now().toString(),
    name: form.name,
    description: form.description,
    flickr_images: imagePreview.value ? [imagePreview.value] : []
  }

  store.addRocket(newRocket)

  dialog.value = false
  resetForm()
}
</script>

<template>
  <v-container>
    <!-- Header -->
    <v-row class="mb-4" align="center" justify="space-between">
      <v-col cols="12" md="6">
        <h2 class="text-h5 font-weight-bold">🚀 Rocket List</h2>
      </v-col>

      <v-col cols="12" md="6" class="text-md-right">
        <v-btn color="primary" @click="openDialog">
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filter -->
    <RocketFilter v-model="filter" />

    <!-- UI State -->
    <UiState
      :loading="loading"
      :error="error"
      @retry="store.fetchRockets"
    />

    <!-- Rocket List -->
    <v-row v-if="!loading && !error">
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        md="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <!-- Add Rocket Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Add New Rocket</v-card-title>

        <v-card-text>
          <v-form ref="formRef">
            <v-text-field
              v-model="form.name"
              label="Rocket Name"
              :rules="[v => !!v || 'Name is required']"
              required
            />

            <v-textarea
              v-model="form.description"
              label="Description"
              :rules="[v => !!v || 'Description is required']"
              required
            />

            <!-- Upload Image -->
            <v-file-input
              label="Rocket Image"
              accept="image/*"
              prepend-icon="mdi-image"
              density="compact"
              @update:model-value="onImageUpload"
            />

            <!-- Image Preview -->
            <v-img
              v-if="imagePreview"
              :src="imagePreview"
              height="180"
              contain
              class="mt-3 bg-grey-darken-3"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="submitRocket">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
