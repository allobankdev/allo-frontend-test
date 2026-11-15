<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center bg-space-950/85 sm:items-center sm:p-4"
      @click.self="close"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-rocket-title"
        class="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-lg border border-space-700 bg-space-900 shadow-2xl shadow-black/60 sm:max-w-2xl sm:rounded-lg"
      >
        <div class="flex items-start justify-between gap-4 border-b border-space-700 px-6 py-4">
          <div>
            <p class="data-label">
              New registry entry
            </p>
            <h2
              id="add-rocket-title"
              class="mt-1 font-display text-2xl font-semibold uppercase tracking-wide text-white"
            >
              Add a rocket
            </h2>
            <p class="mt-1 text-xs text-slate-500">
              Only name and description are required. The rocket is added to this session only.
            </p>
          </div>
          <button
            type="button"
            class="btn-ghost px-2"
            aria-label="Close"
            @click="close"
          >
            <span
              class="mdi mdi-close text-xl"
              aria-hidden="true"
            />
          </button>
        </div>

        <form
          ref="formEl"
          class="flex min-h-0 flex-1 flex-col"
          novalidate
          @submit.prevent="onSubmit"
        >
          <div class="flex flex-col gap-8 overflow-y-auto px-6 py-5">
            <!-- Basic information -->
            <fieldset class="flex flex-col gap-4">
              <legend class="eyebrow mb-4">
                Basic information
              </legend>

              <FormField
                id="rocket-name"
                label="Rocket name"
                required
                :error="visibleErrors.name"
              >
                <input
                  id="rocket-name"
                  ref="nameInput"
                  v-model="values.name"
                  type="text"
                  maxlength="100"
                  placeholder="e.g. Falcon 9 Block 6"
                  class="form-input"
                  :class="{ 'form-input-invalid': visibleErrors.name }"
                  :aria-invalid="!!visibleErrors.name"
                >
              </FormField>

              <FormField
                id="rocket-description"
                label="Description"
                required
                :error="visibleErrors.description"
              >
                <textarea
                  id="rocket-description"
                  v-model="values.description"
                  rows="3"
                  maxlength="1000"
                  placeholder="Short description of the rocket"
                  class="form-input resize-y"
                  :class="{ 'form-input-invalid': visibleErrors.description }"
                  :aria-invalid="!!visibleErrors.description"
                />
              </FormField>

              <FormField
                id="rocket-image"
                label="Image URL"
                :error="visibleErrors.imageUrl"
                hint="Must start with http:// or https://"
              >
                <input
                  id="rocket-image"
                  v-model="values.imageUrl"
                  type="url"
                  placeholder="https://..."
                  class="form-input"
                  :class="{ 'form-input-invalid': visibleErrors.imageUrl }"
                  :aria-invalid="!!visibleErrors.imageUrl"
                >
              </FormField>

              <div class="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="rocket-family"
                  label="Family"
                >
                  <input
                    id="rocket-family"
                    v-model="values.family"
                    type="text"
                    maxlength="50"
                    placeholder="e.g. Falcon"
                    class="form-input"
                  >
                </FormField>
                <FormField
                  id="rocket-variant"
                  label="Variant"
                >
                  <input
                    id="rocket-variant"
                    v-model="values.variant"
                    type="text"
                    maxlength="50"
                    placeholder="e.g. Block 5"
                    class="form-input"
                  >
                </FormField>
              </div>
            </fieldset>

            <!-- Key facts -->
            <fieldset class="flex flex-col gap-4">
              <legend class="eyebrow mb-4">
                Key facts
              </legend>

              <div class="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="rocket-manufacturer"
                  label="Manufacturer"
                >
                  <input
                    id="rocket-manufacturer"
                    v-model="values.manufacturer"
                    type="text"
                    maxlength="100"
                    placeholder="e.g. SpaceX"
                    class="form-input"
                  >
                </FormField>
                <FormField
                  id="rocket-country"
                  label="Country code"
                  :error="visibleErrors.country"
                  hint="2–3 letters, e.g. USA"
                >
                  <input
                    id="rocket-country"
                    v-model="values.country"
                    type="text"
                    maxlength="3"
                    placeholder="USA"
                    class="form-input uppercase"
                    :class="{ 'form-input-invalid': visibleErrors.country }"
                    :aria-invalid="!!visibleErrors.country"
                  >
                </FormField>
                <FormField
                  id="rocket-cost"
                  label="Cost per launch (USD)"
                  :error="visibleErrors.launchCost"
                >
                  <input
                    id="rocket-cost"
                    v-model="values.launchCost"
                    type="text"
                    inputmode="decimal"
                    placeholder="50000000"
                    class="form-input"
                    :class="{ 'form-input-invalid': visibleErrors.launchCost }"
                    :aria-invalid="!!visibleErrors.launchCost"
                  >
                </FormField>
                <FormField
                  id="rocket-first-flight"
                  label="Maiden flight"
                  :error="visibleErrors.firstFlight"
                >
                  <input
                    id="rocket-first-flight"
                    v-model="values.firstFlight"
                    type="date"
                    class="form-input [color-scheme:dark]"
                    :class="{ 'form-input-invalid': visibleErrors.firstFlight }"
                    :aria-invalid="!!visibleErrors.firstFlight"
                  >
                </FormField>
                <FormField
                  id="rocket-status"
                  label="Status"
                >
                  <select
                    id="rocket-status"
                    v-model="values.status"
                    class="form-input"
                  >
                    <option value="">
                      Unknown
                    </option>
                    <option value="active">
                      Active
                    </option>
                    <option value="retired">
                      Retired
                    </option>
                  </select>
                </FormField>
                <FormField
                  id="rocket-reusability"
                  label="Reusability"
                >
                  <select
                    id="rocket-reusability"
                    v-model="values.reusability"
                    class="form-input"
                  >
                    <option value="">
                      Unknown
                    </option>
                    <option value="reusable">
                      Reusable
                    </option>
                    <option value="expendable">
                      Expendable
                    </option>
                  </select>
                </FormField>
              </div>
            </fieldset>

            <!-- Specifications -->
            <fieldset class="flex flex-col gap-4">
              <legend class="eyebrow mb-4">
                Specifications
              </legend>

              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <FormField
                  v-for="field in DECIMAL_SPEC_FIELDS"
                  :id="`rocket-${field.key}`"
                  :key="field.key"
                  :label="`${field.label} (${field.unit})`"
                  :error="visibleErrors[field.key]"
                >
                  <input
                    :id="`rocket-${field.key}`"
                    v-model="values[field.key]"
                    type="text"
                    inputmode="decimal"
                    :placeholder="field.placeholder"
                    class="form-input"
                    :class="{ 'form-input-invalid': visibleErrors[field.key] }"
                    :aria-invalid="!!visibleErrors[field.key]"
                  >
                </FormField>
                <FormField
                  id="rocket-min-stage"
                  label="Min stages"
                  :error="visibleErrors.minStage"
                >
                  <input
                    id="rocket-min-stage"
                    v-model="values.minStage"
                    type="text"
                    inputmode="numeric"
                    placeholder="2"
                    class="form-input"
                    :class="{ 'form-input-invalid': visibleErrors.minStage }"
                    :aria-invalid="!!visibleErrors.minStage"
                  >
                </FormField>
                <FormField
                  id="rocket-max-stage"
                  label="Max stages"
                  :error="visibleErrors.maxStage"
                >
                  <input
                    id="rocket-max-stage"
                    v-model="values.maxStage"
                    type="text"
                    inputmode="numeric"
                    placeholder="2"
                    class="form-input"
                    :class="{ 'form-input-invalid': visibleErrors.maxStage }"
                    :aria-invalid="!!visibleErrors.maxStage"
                  >
                </FormField>
              </div>
            </fieldset>

            <!-- Links -->
            <fieldset class="flex flex-col gap-4">
              <legend class="eyebrow mb-4">
                Links
              </legend>

              <div class="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="rocket-wiki"
                  label="Wikipedia URL"
                  :error="visibleErrors.wikiUrl"
                >
                  <input
                    id="rocket-wiki"
                    v-model="values.wikiUrl"
                    type="url"
                    placeholder="https://en.wikipedia.org/..."
                    class="form-input"
                    :class="{ 'form-input-invalid': visibleErrors.wikiUrl }"
                    :aria-invalid="!!visibleErrors.wikiUrl"
                  >
                </FormField>
                <FormField
                  id="rocket-info"
                  label="Official website"
                  :error="visibleErrors.infoUrl"
                >
                  <input
                    id="rocket-info"
                    v-model="values.infoUrl"
                    type="url"
                    placeholder="https://..."
                    class="form-input"
                    :class="{ 'form-input-invalid': visibleErrors.infoUrl }"
                    :aria-invalid="!!visibleErrors.infoUrl"
                  >
                </FormField>
              </div>
            </fieldset>

            <p class="flex gap-2 rounded-md border border-space-700 bg-space-950 p-3 text-xs text-slate-400">
              <span
                class="mdi mdi-information-outline text-sm text-flare-400"
                aria-hidden="true"
              />
              Launch record (launches and landings) comes from real flight history, so it isn't editable for new rockets.
            </p>
          </div>

          <div class="flex flex-col-reverse gap-3 border-t border-space-700 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
            <p
              v-if="hasVisibleErrors"
              class="order-last text-xs text-rose-400 sm:order-none sm:mr-auto"
              role="alert"
            >
              Please fix the highlighted fields.
            </p>
            <button
              type="button"
              class="btn-secondary"
              @click="close"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn-primary"
            >
              <span
                class="mdi mdi-plus"
                aria-hidden="true"
              />
              Add rocket
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
  import { DECIMAL_SPEC_FIELDS, useRocketForm } from '@/composables/useRocketForm'
  import { useRocketStore } from '@/stores/rockets'
  import type { Rocket } from '@/types/rocket'

  const open = defineModel<boolean>('open', { required: true })
  const emit = defineEmits<{ created: [rocket: Rocket] }>()

  const store = useRocketStore()
  const { values, visibleErrors, reset, submit } = useRocketForm()

  const nameInput = ref<HTMLInputElement | null>(null)
  const formEl = ref<HTMLFormElement | null>(null)
  const hasVisibleErrors = computed(() => Object.keys(visibleErrors.value).length > 0)

  async function onSubmit (): Promise<void> {
    const input = submit()
    if (!input) {
      // Bring the first invalid field into view.
      await nextTick()
      formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }

    // Local state only: the API is read-only, so nothing is sent.
    const rocket = store.addRocket(input)
    emit('created', rocket)
    close()
  }

  function close (): void {
    open.value = false
  }

  function onKeydown (event: KeyboardEvent): void {
    if (event.key === 'Escape') close()
  }

  // Vuetify sets `html { overflow-y: scroll }`, so <html> (not <body>) is the scroll container to lock.
  function setScrollLock (locked: boolean): void {
    document.documentElement.style.overflow = locked ? 'hidden' : ''
  }

  function teardown (): void {
    document.removeEventListener('keydown', onKeydown)
    setScrollLock(false)
  }

  watch(open, async isOpen => {
    if (!isOpen) {
      teardown()
      return
    }
    reset()
    document.addEventListener('keydown', onKeydown)
    setScrollLock(true)
    await nextTick()
    nameInput.value?.focus()
  })

  onBeforeUnmount(teardown)
</script>
