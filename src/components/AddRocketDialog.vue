<template>
  <v-dialog
    :model-value="modelValue"
    max-width="560"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="add-dialog">
      <v-card-title class="dialog-title">
        <span>Add to the fleet</span>
        <v-btn
          aria-label="Close dialog"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="close"
        />
      </v-card-title>
      <v-card-text>
        <p class="dialog-description">
          Add a vehicle to this session's local catalogue.
        </p>
        <v-text-field
          v-model="form.name"
          autofocus
          class="dialog-input"
          label="Rocket name *"
          placeholder="e.g. Starship"
          variant="outlined"
          @keydown.enter.prevent="save"
        />
        <v-textarea
          v-model="form.description"
          class="dialog-input"
          label="Description"
          rows="3"
          variant="outlined"
        />
        <v-text-field
          v-model="form.imageUrl"
          class="dialog-input"
          label="Image URL"
          placeholder="https://..."
          variant="outlined"
        />
        <div class="detail-inputs">
          <v-text-field
            v-model="form.launchCost"
            class="dialog-input"
            label="Cost per launch"
            prefix="$"
            variant="outlined"
          />
          <v-text-field
            v-model="form.country"
            class="dialog-input"
            label="Country"
            variant="outlined"
          />
        </div>
        <v-text-field
          v-model="form.maidenFlight"
          class="dialog-input"
          label="First flight"
          placeholder="YYYY-MM-DD"
          variant="outlined"
        />
        <p
          v-if="validationMessage"
          class="validation-message"
        >
          {{ validationMessage }}
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          variant="flat"
          @click="save"
        >
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import type { NewRocket } from '@/stores/rockets'

  defineProps<{ modelValue: boolean }>()
  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    save: [rocket: NewRocket]
  }>()

  const emptyForm = () => ({ name: '', description: '', imageUrl: '', launchCost: '', country: '', maidenFlight: '' })
  const form = reactive(emptyForm())
  const validationMessage = ref('')

  watch(() => form.name, () => { validationMessage.value = '' })

  function close () {
    emit('update:modelValue', false)
  }

  function save () {
    const name = form.name.trim()
    if (!name) {
      validationMessage.value = 'Please enter a rocket name.'
      return
    }

    emit('save', {
      name,
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      launchCost: form.launchCost.trim() || null,
      country: form.country.trim() || null,
      maidenFlight: form.maidenFlight.trim() || null,
    })
    Object.assign(form, emptyForm())
    validationMessage.value = ''
  }
</script>

<style scoped>
  .add-dialog { background: #171b19; color: #f1f1ed; }
  .dialog-title { display: flex; align-items: center; justify-content: space-between; padding: 22px 24px 4px; font-size: 21px; }
  .dialog-description { margin: 0 0 20px; color: #999f9c; font-size: 13px; }
  .dialog-input { margin-bottom: 9px; }
  :deep(.dialog-input .v-field) { border-radius: 7px; }
  :deep(.dialog-input .v-field__input), :deep(.dialog-input .v-label) { font-size: 13px; }
  .detail-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .validation-message { margin: 0; color: #ff9c8e; font-size: 12px; }
  @media (max-width: 480px) { .detail-inputs { grid-template-columns: 1fr; gap: 0; } }
</style>
