<script setup lang="ts">
import { reactive, ref } from 'vue'
import {VForm} from 'vuetify/components'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'submit',
])

const form = reactive({
  name: '',
  full_name: '',
  description: '',
  image_url: '',
})

const formRef = ref<InstanceType<typeof VForm> | null>(null)

const nameRules = [
  (value: string) => {
    return value?.trim()
      ? true
      : 'Rocket Name wajib diisi'
  },
]

const close = () => {
  emit('update:modelValue', false)
}

const submit = async () => {
  if (!formRef.value) return
  const { valid } = await formRef.value.validate()

  if (!valid) {
    return
  }

  emit('submit', {
    ...form,
  })

  form.name = ''
  form.full_name = ''
  form.description = ''
  form.image_url = ''

  close()
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>
        Add Rocket
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef">
          <v-text-field
            v-model="form.name"
            label="Rocket Name"
            variant="outlined"
            class="mb-3"
            :rules="nameRules"
          />

          <v-text-field
            v-model="form.full_name"
            label="Full Name"
            variant="outlined"
            class="mb-3"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            variant="outlined"
          />
        </v-form>
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
          variant="flat"
          @click="submit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>