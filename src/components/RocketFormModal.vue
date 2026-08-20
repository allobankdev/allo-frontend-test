<template>
  <Transition name="fade">
    <div v-if="modelValue" class="modal-backdrop" aria-hidden="true" @click="resetAndClose" />
  </Transition>

  <Transition name="modal-enter">
    <div
      v-if="modelValue"
      id="add-rocket-modal"
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      @keydown.esc="resetAndClose"
    >
      <div ref="modalInnerRef" class="modal__inner">
        <div class="modal__header">
          <h2 id="modal-title" class="modal__title">Add New Rocket</h2>
          <button
            type="button"
            class="modal__close"
            aria-label="Close dialog"
            @click="resetAndClose"
          >
            ✕
          </button>
        </div>

        <form id="add-rocket-form" class="modal__form" novalidate @submit.prevent="handleSubmit">
          <div class="form-field">
            <label class="form-field__label" for="field-name">
              Rocket Name <span class="form-field__required" aria-hidden="true">*</span>
            </label>
            <input
              id="field-name"
              v-model.trim="form.name"
              type="text"
              class="form-field__input"
              :class="{ 'form-field__input--error': errors.name }"
              placeholder="e.g. Falcon 9 Block 5"
              autocomplete="off"
              aria-required="true"
              :aria-describedby="errors.name ? 'error-name' : undefined"
            />
            <p v-if="errors.name" id="error-name" class="form-field__error" role="alert">
              {{ errors.name }}
            </p>
          </div>

          <div class="form-field">
            <label class="form-field__label" for="field-description">Description</label>
            <textarea
              id="field-description"
              v-model.trim="form.description"
              class="form-field__input form-field__textarea"
              placeholder="Brief description of the rocket…"
              rows="3"
            />
          </div>

          <div class="form-field">
            <label class="form-field__label" for="field-image">Image URL</label>
            <input
              id="field-image"
              v-model.trim="form.imageUrl"
              type="url"
              class="form-field__input"
              :class="{ 'form-field__input--error': errors.imageUrl }"
              placeholder="https://example.com/rocket.jpg"
              :aria-describedby="errors.imageUrl ? 'error-image' : undefined"
            />
            <p v-if="errors.imageUrl" id="error-image" class="form-field__error" role="alert">
              {{ errors.imageUrl }}
            </p>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label class="form-field__label" for="field-cost">Launch Cost (USD)</label>
              <input
                id="field-cost"
                v-model.trim="form.launchCost"
                type="number"
                min="0"
                class="form-field__input"
                :class="{ 'form-field__input--error': errors.launchCost }"
                placeholder="e.g. 62000000"
                :aria-describedby="errors.launchCost ? 'error-cost' : undefined"
              />
              <p v-if="errors.launchCost" id="error-cost" class="form-field__error" role="alert">
                {{ errors.launchCost }}
              </p>
            </div>

            <div class="form-field">
              <label class="form-field__label" for="field-country">Country Code</label>
              <input
                id="field-country"
                v-model.trim="form.country"
                type="text"
                class="form-field__input"
                placeholder="e.g. USA"
                maxlength="10"
              />
            </div>
          </div>

          <div class="form-field">
            <label class="form-field__label" for="field-flight">First Flight Date</label>
            <input
              id="field-flight"
              v-model="form.maidenFlight"
              type="date"
              class="form-field__input"
            />
          </div>

          <div class="modal__actions">
            <BaseButton
              id="cancel-add-rocket-btn"
              type="button"
              variant="ghost"
              @click="resetAndClose"
            >
              Cancel
            </BaseButton>
            <BaseButton id="submit-add-rocket-btn" type="submit" variant="primary">
              Add Rocket
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import { useRocketStore } from '@/stores/rocket.store'
import type { NewRocketInput } from '@/types/rocket'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  closed: []
}>()

const store = useRocketStore()
const modalInnerRef = ref<HTMLElement | null>(null)

const initialForm = (): NewRocketInput => ({
  name: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  country: '',
  maidenFlight: '',
})

const form = ref<NewRocketInput>(initialForm())
const errors = ref<Partial<Record<keyof NewRocketInput, string>>>({})

function validate(): boolean {
  errors.value = {}

  if (!form.value.name) {
    errors.value.name = 'Rocket name is required.'
  }

  if (form.value.imageUrl) {
    try {
      const url = new URL(form.value.imageUrl)
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.value.imageUrl = 'Image URL must use http or https.'
      }
    } catch {
      errors.value.imageUrl = 'Please enter a valid URL.'
    }
  }

  if (form.value.launchCost !== '') {
    const cost = Number(form.value.launchCost)
    if (isNaN(cost) || cost < 0) {
      errors.value.launchCost = 'Launch cost must be a non-negative number.'
    }
  }

  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  store.addRocket(form.value)
  resetAndClose()
}

function resetAndClose() {
  form.value = initialForm()
  errors.value = {}
  emit('update:modelValue', false)
  emit('closed')
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      await nextTick()
      const first = modalInnerRef.value?.querySelector<HTMLElement>('input, textarea, button')
      first?.focus()
    }
  },
)
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
}

.modal {
  position: fixed;
  inset: 0;
  z-index: 201;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal__inner {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  width: 100%;
  max-width: 520px;
  max-height: 90dvh;
  overflow-y: auto;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.25rem 0;
}

.modal__title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text);
}

.modal__close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  line-height: 1;
}

.modal__close:hover {
  color: var(--text);
  background: var(--surface-raised);
}

.modal__close:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.modal__form {
  padding: 1.125rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-field__label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
}

.form-field__required {
  color: var(--error);
  margin-left: 2px;
}

.form-field__input {
  padding: 0.55rem 0.75rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.15s;
  width: 100%;
  box-sizing: border-box;
}

.form-field__input:focus {
  outline: none;
  border-color: var(--border-focus);
}

.form-field__input--error {
  border-color: var(--error);
}

.form-field__textarea {
  resize: vertical;
  min-height: 72px;
}

.form-field__error {
  font-size: 0.78rem;
  color: var(--error);
  margin: 0;
}

.form-field__input[type='date'] {
  color-scheme: dark;
}

.form-field__input[type='number']::-webkit-inner-spin-button,
.form-field__input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 0.25rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-enter-active,
.modal-enter-leave-active {
  transition: opacity 0.15s ease;
}
.modal-enter-enter-from,
.modal-enter-leave-to {
  opacity: 0;
}
</style>
