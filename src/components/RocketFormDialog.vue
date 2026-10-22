<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        @click.self="close"
      >
        <form
          aria-labelledby="rocket-form-title"
          aria-modal="true"
          class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl"
          novalidate
          role="dialog"
          @submit.prevent="submit"
        >
          <div class="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2
                id="rocket-form-title"
                class="text-xl font-semibold"
              >
                Add Rocket
              </h2>
              <p class="mt-1 text-sm text-muted">
                Only the name is required. The rocket lives in this session only.
              </p>
            </div>
            <button
              aria-label="Close"
              class="icon-btn border-gray-200 text-muted hover:text-ink"
              type="button"
              @click="close"
            >
              <i class="mdi mdi-close" />
            </button>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <FormField
              class="sm:col-span-2"
              :error="errors.fullName"
              label="Name"
              required
            >
              <input
                ref="nameInput"
                v-model="form.fullName"
                class="input"
                placeholder="e.g. Falcon 10"
              >
            </FormField>

            <FormField
              class="sm:col-span-2"
              label="Description"
            >
              <textarea
                v-model="form.description"
                class="input resize-none"
                placeholder="Short description of the rocket"
                rows="3"
              />
            </FormField>

            <FormField
              class="sm:col-span-2"
              :error="errors.imageUrl"
              label="Image URL"
            >
              <input
                v-model="form.imageUrl"
                class="input"
                placeholder="https://"
                type="url"
              >
            </FormField>

            <FormField
              :error="errors.launchCost"
              label="Cost per launch (USD)"
            >
              <input
                v-model="form.launchCost"
                class="input"
                inputmode="numeric"
                placeholder="50000000"
              >
            </FormField>

            <FormField label="Country code">
              <input
                v-model="form.countryCode"
                class="input uppercase"
                maxlength="3"
                placeholder="USA"
              >
            </FormField>

            <FormField label="First flight">
              <input
                v-model="form.maidenFlight"
                class="input"
                type="date"
              >
            </FormField>

            <label class="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-gray-200 px-4 py-2.5 text-sm">
              <input
                v-model="form.active"
                class="size-4 accent-brand-700"
                type="checkbox"
              >
              Active rocket
            </label>
          </div>

          <div class="mt-8 flex justify-end gap-3">
            <button
              class="btn btn-outline"
              type="button"
              @click="close"
            >
              Cancel
            </button>
            <button
              class="btn btn-primary"
              type="submit"
            >
              <i class="mdi mdi-plus text-base" />
              Add Rocket
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
  import { nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
  import type { NewRocket } from '@/types/rocket'

  type FormErrors = Partial<Record<keyof NewRocket, string>>

  const open = defineModel<boolean>({ required: true })
  const emit = defineEmits<{ submit: [rocket: NewRocket] }>()

  const createEmptyForm = (): NewRocket => ({
    fullName: '',
    description: '',
    imageUrl: '',
    launchCost: '',
    countryCode: '',
    maidenFlight: '',
    active: true,
  })

  const form = reactive<NewRocket>(createEmptyForm())
  const errors = reactive<FormErrors>({})
  const nameInput = ref<HTMLInputElement>()

  function validate (): boolean {
    errors.fullName = form.fullName.trim() ? '' : 'Name is required'
    errors.imageUrl = !form.imageUrl || /^https?:\/\/\S+$/i.test(form.imageUrl) ? '' : 'Enter a valid http(s) URL'
    errors.launchCost = !form.launchCost || /^\d+$/.test(form.launchCost) ? '' : 'Enter a whole number'
    return Object.values(errors).every(error => !error)
  }

  function close () {
    open.value = false
  }

  function submit () {
    if (!validate()) return
    emit('submit', { ...form })
    close()
  }

  function closeOnEscape (event: KeyboardEvent) {
    if (event.key === 'Escape') close()
  }

  watch(open, async isOpen => {
    if (isOpen) {
      Object.assign(form, createEmptyForm())
      Object.assign(errors, { fullName: '', imageUrl: '', launchCost: '' })
      window.addEventListener('keydown', closeOnEscape)
      await nextTick()
      nameInput.value?.focus()
    } else {
      window.removeEventListener('keydown', closeOnEscape)
    }
  })

  onBeforeUnmount(() => window.removeEventListener('keydown', closeOnEscape))
</script>
