<script setup lang="ts">
import {
  reactive,
  ref,
} from 'vue'

import SafeImage
  from '@/components/common/SafeImage.vue'

import type {
  NewRocketInput,
} from '@/types/rocket'


defineProps<{
  open: boolean
}>()

const emit =
  defineEmits<{
    close: []
    add: [rocket: NewRocketInput]
  }>()

const imageSource =
  ref<'url' | 'upload'>('url')

const uploadedImageUrl =
  ref('')

const form =
  reactive({
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    country_code: '',
    maiden_flight: '',
  })

function handleImageChange(
  event: Event,
) {
  const input =
    event.target as HTMLInputElement

  const file =
    input.files?.[0]

  if (!file) {
    return
  }

  if (uploadedImageUrl.value) {
    URL.revokeObjectURL(
      uploadedImageUrl.value,
    )
  }

  const objectUrl =
    URL.createObjectURL(file)


  uploadedImageUrl.value =
    objectUrl

  form.image_url =
    objectUrl
}

function changeImageSource(
  source: 'url' | 'upload',
) {
  if (
    uploadedImageUrl.value
  ) {
    URL.revokeObjectURL(
      uploadedImageUrl.value,
    )

    uploadedImageUrl.value = ''
  }

  imageSource.value =
    source

  form.image_url = ''
}

function resetForm(
  revokeUpload = true,
) {
  if (
    revokeUpload &&
    uploadedImageUrl.value
  ) {
    URL.revokeObjectURL(
      uploadedImageUrl.value,
    )
  }

  uploadedImageUrl.value = ''

  imageSource.value = 'url'

  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = ''
  form.country_code = ''
  form.maiden_flight = ''
}

function closeModal() {
  resetForm(true)

  emit('close')
}

function submit() {
  const name =
    form.full_name.trim()

  if (!name) {
    return
  }

  emit('add', {
    full_name:
      name,

    description:
      form.description.trim(),

    image_url:
      imageSource.value === 'url'
        ? form.image_url.trim()
        : form.image_url,

    launch_cost:
      form.launch_cost,

    country_code:
      form.country_code
        .trim()
        .toUpperCase(),

    maiden_flight:
      form.maiden_flight,
  })

  resetForm(false)

  emit('close')
}
</script>

<template>
  <div
    v-if="open"
    class="overlay"
    @click.self="closeModal">
    <form
      class="modal"
      @submit.prevent="submit">
      <div class="modal-header">
        <div>
          <h2>
            Add Rocket
          </h2>
          <p>
            Add a rocket for this session.
          </p>
        </div>
        <button
          class="close-button"
          type="button"
          @click="closeModal">
          ×
        </button>
      </div>
      <div class="form-grid">
        <label>
          Rocket Name *
          <input
            v-model="form.full_name"
            type="text"
            placeholder="Falcon X"
            required>
        </label>

        <label>
          Cost per Launch
          <input
            v-model="form.launch_cost"
            type="number"
            min="0"
            placeholder="67000000"
          >
        </label>

        <label>
          Country Code
          <input
            v-model="form.country_code"
            type="text"
            maxlength="3"
            placeholder="USA"
          >
        </label>

        <label>
          First Flight

          <input
            v-model="form.maiden_flight"
            type="date"
          >
        </label>

        <label>
          Description
          <textarea
            v-model="form.description"
            rows="6"
            placeholder="Rocket description..."
          ></textarea>
        </label>

        <div class="image-field">

          <span class="field-label">
            Rocket Image
          </span>
          <div class="image-options">
            <label class="radio-option">
              <input
                type="radio"
                name="image-source"
                :checked="
                  imageSource === 'url'
                "
                @change="
                  changeImageSource('url')
                "
              >
              Image URL
            </label>
            <label class="radio-option">
              <input
                type="radio"
                name="image-source"
                :checked="
                  imageSource === 'upload'
                "
                @change="changeImageSource('upload')">
              Upload Photo
            </label>
          </div>

          <input
            v-if="
              imageSource === 'url'
            "
            v-model="form.image_url"
            type="url"
            placeholder="https://example.com/rocket.jpg">

          <input
            class="pilih-file"
            v-else
            type="file"
            accept="image/*"
            @change="handleImageChange">

          <div
            v-if="form.image_url"
            class="image-preview">

            <SafeImage
              :src="form.image_url"
              alt="Rocket preview"/>
          </div>
        </div>
      </div>
      <div class="actions">

        <button
          class="secondary-button"
          type="button"
          @click="closeModal">
          Cancel
        </button>

        <button
          class="primary-button"
          type="submit">
          Add Rocket
        </button>

      </div>

    </form>

  </div>
</template>

<style scoped
  src="@/components/rocket/style/addrocket.css"
></style>
