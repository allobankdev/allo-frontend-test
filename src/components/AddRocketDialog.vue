<template>
  <v-dialog
    v-model="isOpen"
    max-width="560"
    scrollable
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
        variant="flat"
      >
        Add rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h6">
        Add a rocket
      </v-card-title>
      <v-card-subtitle class="text-wrap pb-2">
        The API is read-only, so this rocket lives in the app for this session only.
      </v-card-subtitle>

      <v-divider />

      <v-card-text>
        <v-form
          ref="formRef"
          validate-on="submit"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="form.name"
            class="mb-2"
            density="comfortable"
            label="Name *"
            :rules="nameRules"
            variant="outlined"
          />
          <v-textarea
            v-model="form.description"
            class="mb-2"
            density="comfortable"
            label="Description"
            rows="3"
            variant="outlined"
          />
          <v-text-field
            v-model="form.imageUrl"
            class="mb-2"
            density="comfortable"
            label="Image URL"
            placeholder="https://…"
            :rules="urlRules"
            variant="outlined"
          />
          <v-text-field
            v-model="form.launchCost"
            class="mb-2"
            density="comfortable"
            label="Cost per launch (USD)"
            placeholder="50000000"
            :rules="costRules"
            variant="outlined"
          />
          <v-text-field
            v-model="form.country"
            class="mb-2"
            density="comfortable"
            label="Country code"
            maxlength="3"
            placeholder="USA"
            variant="outlined"
          />
          <v-text-field
            v-model="form.firstFlight"
            density="comfortable"
            label="First flight"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="isOpen = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="submit"
        >
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue'
  import type { VForm } from 'vuetify/components'
  import { useRocketsStore } from '@/stores/rockets'
  import type { NewRocketInput, Rocket } from '@/types/rocket'

  const emit = defineEmits<{ added: [rocket: Rocket] }>()

  const store = useRocketsStore()

  const isOpen = ref(false)
  const formRef = ref<VForm>()

  function emptyForm (): NewRocketInput {
    return { name: '', description: '', imageUrl: '', launchCost: '', country: '', firstFlight: '' }
  }

  const form = reactive<NewRocketInput>(emptyForm())

  const nameRules = [
    (value: string) => Boolean(value?.trim()) || 'Name is required.',
  ]

  const urlRules = [
    (value: string) => !value?.trim() || /^https?:\/\/\S+$/i.test(value.trim())
      || 'Enter a valid URL starting with http:// or https://',
  ]

  const costRules = [
    (value: string) => !value?.trim() || /^[\d,.\s]+$/.test(value.trim())
      || 'Enter numbers only, e.g. 50000000',
  ]

  // Reset on close so reopening never shows the previous entry.
  watch(isOpen, open => {
    if (open) return
    Object.assign(form, emptyForm())
    formRef.value?.resetValidation()
  })

  async function submit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    emit('added', store.addRocket({ ...form }))
    isOpen.value = false
  }
</script>
