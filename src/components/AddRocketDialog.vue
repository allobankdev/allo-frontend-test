<template>
  <v-dialog
    v-model="open"
    max-width="560"
  >
    <v-card title="Add rocket">
      <v-card-text>
        <v-form
          ref="form"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="name"
            label="Name"
            :rules="[required]"
            variant="outlined"
          />
          <v-textarea
            v-model="description"
            label="Description"
            rows="3"
            variant="outlined"
          />
          <v-text-field
            v-model="imageUrl"
            label="Image URL"
            :rules="[validUrl]"
            variant="outlined"
          />
          <v-text-field
            v-model="launchCost"
            label="Cost per launch (USD)"
            type="number"
            min="0"
            :rules="[validCost]"
            variant="outlined"
          />
          <v-text-field
            v-model="countryCode"
            label="Country code (e.g. USA)"
            variant="outlined"
          />
          <v-text-field
            v-model="maidenFlight"
            label="First flight"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="close">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="submit"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { VForm } from 'vuetify/components'
  import { useRocketStore } from '@/stores/rocket'

  const open = defineModel<boolean>({ default: false })

  const store = useRocketStore()
  const form = ref<VForm | null>(null)

  const name = ref('')
  const description = ref('')
  const imageUrl = ref('')
  const launchCost = ref('')
  const countryCode = ref('')
  const maidenFlight = ref('')

  function required(value: string): boolean | string {
    return value.trim() !== '' || 'Name is required'
  }

  function validUrl(value: string): boolean | string {
    if (value.trim() === '') return true
    try {
      const url = new URL(value.trim())
      return ['http:', 'https:'].includes(url.protocol) || 'Use an http or https URL'
    } catch {
      return 'Enter a valid URL'
    }
  }

  function validCost(value: string | null): boolean | string {
    if (!value) return true
    return Number(value) >= 0 || 'Must be zero or more'
  }

  function resetFields() {
    name.value = ''
    description.value = ''
    imageUrl.value = ''
    launchCost.value = ''
    countryCode.value = ''
    maidenFlight.value = ''
    form.value?.resetValidation()
  }

  function close() {
    open.value = false
    resetFields()
  }

  async function submit() {
    const result = await form.value?.validate()
    if (!result?.valid) return
    store.addRocket({
      name: name.value,
      description: description.value,
      imageUrl: imageUrl.value,
      launchCost: launchCost.value ? Number(launchCost.value) : null,
      countryCode: countryCode.value.trim().toUpperCase(),
      maidenFlight: maidenFlight.value,
    })
    store.resetFilters()
    close()
  }
</script>