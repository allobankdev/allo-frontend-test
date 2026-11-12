<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { NewRocketInput } from '../types/rocket'

const emit = defineEmits<{
  submit: [rocket: NewRocketInput]
  cancel: []
}>()

const form = reactive<NewRocketInput>({
  name: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  country: '',
  maidenFlight: '',
})
const nameError = ref('')

function onSubmit(): void {
  if (!form.name.trim()) {
    nameError.value = 'Enter a rocket name.'
    return
  }
  emit('submit', { ...form })
}
</script>

<template>
  <form class="form" novalidate @submit.prevent="onSubmit">
    <label class="field">
      <span>Name</span>
      <input v-model="form.name" class="input" required @input="nameError = ''" />
      <small v-if="nameError" class="field__error" role="alert">{{ nameError }}</small>
    </label>
    <label class="field">
      <span>Description</span>
      <textarea v-model="form.description" class="input" rows="3" />
    </label>
    <label class="field">
      <span>Image URL</span>
      <input v-model="form.imageUrl" class="input" type="url" />
    </label>
    <div class="form__row">
      <label class="field">
        <span>Cost per launch (USD)</span>
        <input v-model.number="form.launchCost" class="input" type="number" min="0" />
      </label>
      <label class="field">
        <span>Country code</span>
        <input v-model="form.country" class="input" maxlength="3" />
      </label>
      <label class="field">
        <span>First flight</span>
        <input v-model="form.maidenFlight" class="input" type="date" />
      </label>
    </div>
    <div class="form__actions">
      <button type="submit" class="btn">Add rocket</button>
      <button type="button" class="btn btn--ghost" @click="$emit('cancel')">Cancel</button>
    </div>
  </form>
</template>
