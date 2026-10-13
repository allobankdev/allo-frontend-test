<template>
  <div
    class="modal-backdrop"
    @click.self="$emit('close')"
  >
    <form
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-rocket-title"
      @submit.prevent="submit"
      @keydown.esc="$emit('close')"
    >
      <button
        class="modal-close"
        type="button"
        aria-label="Close"
        @click="$emit('close')"
      >
        ×
      </button>
      <p class="eyebrow muted">
        Grow the collection
      </p>
      <h2 id="add-rocket-title">
        Add a launcher
      </h2>
      <p class="modal-intro">
        Add a rocket to your local collection. It will be available until you refresh.
      </p>

      <label class="form-field">
        Rocket name
        <input
          v-model.trim="form.name"
          required
          maxlength="100"
          placeholder="e.g. Starship"
        >
      </label>
      <label class="form-field">
        Description <span class="optional">Optional</span>
        <textarea
          v-model.trim="form.description"
          rows="3"
          maxlength="500"
          placeholder="A short description"
        />
      </label>
      <label class="form-field">
        Image URL <span class="optional">Optional</span>
        <input
          v-model.trim="form.image"
          type="url"
          placeholder="https://..."
        >
      </label>

      <button
        class="action-button submit-button"
        type="submit"
      >
        Add to collection <span>↗</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits<{
  close: []
  add: [rocket: { name: string; description: string; image: string }]
}>()

const form = reactive({ name: '', description: '', image: '' })

function submit() {
  emit('add', { ...form })
}
</script>
