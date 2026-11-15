<script setup lang="ts">
import { reactive, ref } from 'vue'
import { imageUrl } from '@/services/rockets'
import { rocketStore } from '@/stores/rockets'

const emit = defineEmits<{ added: [name: string] }>()
const dialog = ref<HTMLDialogElement>()
const error = ref('')
const empty = () => ({ name: '', description: '', image: '', cost: '', country: '', firstFlight: '' })
const form = reactive(empty())

function open() {
  Object.assign(form, empty())
  error.value = ''
  dialog.value?.showModal()
}

function submit() {
  if (!form.name.trim()) {
    error.value = 'Enter a rocket name.'
    return
  }
  const image = imageUrl(form.image)
  if (form.image.trim() && !image) {
    error.value = 'Use a complete http:// or https:// image URL.'
    return
  }
  const cost = String(form.cost).trim()
  if (cost && (!Number.isFinite(Number(cost)) || Number(cost) < 0)) {
    error.value = 'Launch cost must be zero or greater.'
    return
  }
  rocketStore.addRocket({
    name: form.name.trim(),
    description: form.description.trim() || 'A description is not available for this rocket.',
    imageUrl: image,
    cost: cost || null,
    country: form.country.trim().toUpperCase() || null,
    firstFlight: form.firstFlight || null,
    family: null,
  })
  emit('added', form.name.trim())
  dialog.value?.close()
}
</script>

<template>
  <v-btn
    color="primary"
    variant="flat"
    class="add-button"
    @click="open"
  >
    <span
      aria-hidden="true"
      class="plus-sign"
    >+</span> Add rocket
  </v-btn>
  <dialog
    ref="dialog"
    class="add-dialog"
    aria-labelledby="add-title"
  >
    <form @submit.prevent="submit">
      <div class="dialog-heading">
        <h2 id="add-title">
          Add a rocket
        </h2>
        <button
          type="button"
          class="close-button"
          aria-label="Close dialog"
          @click="dialog?.close()"
        >
          ×
        </button>
      </div>
      <p class="form-note">
        Your rocket stays in this app until the page is refreshed. Only the name is required.
      </p>
      <label for="rocket-name">Rocket name <span aria-hidden="true">*</span></label>
      <input
        id="rocket-name"
        v-model="form.name"
        required
        maxlength="120"
        autofocus
        placeholder="e.g. Garuda 1"
      >
      <label for="rocket-description">Description</label>
      <textarea
        id="rocket-description"
        v-model="form.description"
        rows="3"
        maxlength="3000"
        placeholder="What makes this rocket unique?"
      />
      <label for="rocket-image">Image URL</label>
      <input
        id="rocket-image"
        v-model="form.image"
        type="url"
        placeholder="https://example.com/rocket.jpg"
      >
      <div class="form-row">
        <div>
          <label for="rocket-cost">Cost per launch (USD)</label>
          <input
            id="rocket-cost"
            v-model="form.cost"
            type="number"
            min="0"
            step="0.01"
            placeholder="Optional"
          >
        </div>
        <div>
          <label for="rocket-country">Country code</label>
          <input
            id="rocket-country"
            v-model="form.country"
            maxlength="20"
            placeholder="e.g. IDN"
          >
        </div>
      </div>
      <label for="rocket-flight">First flight</label>
      <input
        id="rocket-flight"
        v-model="form.firstFlight"
        type="date"
      >
      <p
        v-if="error"
        class="form-error"
        role="alert"
      >
        {{ error }}
      </p>
      <div class="dialog-actions">
        <v-btn
          variant="text"
          @click="dialog?.close()"
        >
          Cancel
        </v-btn>
        <v-btn
          type="submit"
          color="primary"
          variant="flat"
        >
          Save rocket
        </v-btn>
      </div>
    </form>
  </dialog>
</template>
