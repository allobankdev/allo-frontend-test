<template>
  <v-dialog
    v-model="open"
    max-width="560"
  >
    <v-card>
      <v-card-title>Add Rocket</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="form.full_name"
          label="Name *"
          placeholder="e.g. Falcon 9"
        />
        <v-textarea
          v-model="form.description"
          label="Description"
          rows="3"
        />
        <v-text-field
          v-model="form.image_url"
          label="Image URL"
          placeholder="https://..."
        />
        <v-text-field
          v-model="form.launch_cost"
          label="Cost per launch (USD)"
          type="number"
        />
        <v-text-field
          v-model="form.maiden_flight"
          label="First flight"
          type="date"
        />
        <v-text-field
          v-model="form.country_code"
          label="Country code"
          placeholder="e.g. USA"
        />
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
          :disabled="!isValid"
          @click="submit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { computed, reactive } from 'vue'
  import type { RocketForm } from '@/types/rocket'

  const open = defineModel<boolean>({ required: true })

  const emit = defineEmits<{ submit: [form: RocketForm] }>()

  function emptyForm (): RocketForm {
    return {
      full_name: '',
      description: '',
      image_url: '',
      launch_cost: '',
      maiden_flight: '',
      country_code: '',
    }
  }

  const form = reactive<RocketForm>(emptyForm())

  const isValid = computed(() => form.full_name.trim().length > 0)

  function close () {
    open.value = false
  }

  function submit () {
    if (!isValid.value) return

    emit('submit', { ...form, full_name: form.full_name.trim() })
    Object.assign(form, emptyForm())
    open.value = false
  }
</script>
