<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center"
      @click.self="close"
    >
      <div
        class="w-full max-w-lg rounded-2xl bg-white px-6 py-8 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-rocket-title"
      >
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="add-rocket-title"
              class="text-lg font-semibold text-slate-900"
            >
              Add rocket
            </h2>
            <p class="text-sm text-slate-500">
              *the API is read-only, so the new rocket only needs to appear in the running app
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
            @click="close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <div>
            <label
              for="full_name"
              class="mb-1 block text-sm font-medium text-slate-700"
            >
              Name <span class="text-red-500">*</span>
            </label>
            <input
              id="full_name"
              v-model.trim="form.full_name"
              type="text"
              required
              placeholder="e.g. Falcon 9 Block 5"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
            <p
              v-if="error"
              class="mt-1 text-xs text-red-600"
            >
              {{ error }}
            </p>
          </div>

          <div>
            <label
              for="description"
              class="mb-1 block text-sm font-medium text-slate-700"
            >Description</label>
            <textarea
              id="description"
              v-model.trim="form.description"
              rows="3"
              placeholder="Optional"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label
              for="image_url"
              class="mb-1 block text-sm font-medium text-slate-700"
            >Image URL</label>
            <input
              id="image_url"
              v-model.trim="form.image_url"
              type="url"
              placeholder="https://..."
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                for="launch_cost"
                class="mb-1 block text-sm font-medium text-slate-700"
              >Cost per launch (USD)</label>
              <input
                id="launch_cost"
                v-model.trim="form.launch_cost"
                type="string"
                min="0"
                placeholder="e.g. 50000000"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
            </div>
            <div>
              <label
                for="country_code"
                class="mb-1 block text-sm font-medium text-slate-700"
              >Country</label>
              <input
                id="country_code"
                v-model.trim="form.country_code"
                type="text"
                maxlength="3"
                placeholder="e.g. USA"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
            </div>
            <div>
              <label
                for="maiden_flight"
                class="mb-1 block text-sm font-medium text-slate-700"
              >First flight</label>
              <input
                id="maiden_flight"
                v-model="form.maiden_flight"
                type="date"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              @click="close"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-black transition hover:bg-brand-700"
            >
              Add rocket
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue'
  import type { NewRocketInput } from '@/types/rocket'

  const props = defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', rocket: NewRocketInput): void
  }>()

  const emptyForm = (): Record<keyof NewRocketInput, string> => ({
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    maiden_flight: '',
    country_code: '',
  })

  const form = reactive(emptyForm())
  const error = ref<string | null>(null)

  watch(() => props.modelValue, isOpen => {
    if (isOpen) {
      Object.assign(form, emptyForm())
      error.value = null
    }
  })

  function close () {
    emit('update:modelValue', false)
  }

  function handleSubmit () {
    if (!form.full_name.trim()) {
      error.value = 'Name is required.'
      return
    }
    console.log(form)

    emit('submit', {
      full_name: form.full_name.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      launch_cost: form.launch_cost.trim() || null,
      maiden_flight: form.maiden_flight || null,
      country_code: form.country_code.trim() || null,
    })

    close()
  }
</script>
