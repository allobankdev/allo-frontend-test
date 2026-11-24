<template>
  <v-dialog
    v-model="model"
    :fullscreen="xs"
    max-width="600"
  >
    <v-card class="rounded-lg">
      <v-card-title class="d-flex align-center ga-2 text-h6 font-weight-bold pt-5 px-6">
        <v-icon
          color="primary"
          icon="mdi-rocket-launch-outline"
        />
        <span>Add rocket</span>
      </v-card-title>

      <v-form
        ref="formRef"
        @submit.prevent="onSubmit"
      >
        <v-card-text class="px-6 pt-3 pb-2">
          <v-text-field
            v-model="form.name"
            autofocus
            class="mb-3"
            counter="100"
            density="comfortable"
            label="Rocket name *"
            :rules="[validateName]"
            variant="outlined"
          />

          <v-textarea
            v-model="form.description"
            class="mb-3"
            counter="1000"
            density="comfortable"
            label="Description"
            rows="3"
            :rules="[validateDescription]"
            variant="outlined"
          />

          <v-text-field
            v-model="form.imageUrl"
            class="mb-3"
            density="comfortable"
            label="Image URL"
            placeholder="https://example.com/rocket.jpg"
            :rules="[validateImageUrl]"
            variant="outlined"
          />

          <v-text-field
            v-model="form.launchCost"
            class="mb-3"
            density="comfortable"
            inputmode="decimal"
            label="Launch cost (USD)"
            prefix="$"
            :rules="[validateLaunchCost]"
            variant="outlined"
          />

          <v-text-field
            v-model="form.country"
            class="mb-3"
            density="comfortable"
            label="Country"
            :rules="[validateCountry]"
            variant="outlined"
          />

          <v-text-field
            v-model="form.maidenFlight"
            density="comfortable"
            label="First flight"
            :rules="[validateMaidenFlight]"
            type="date"
            variant="outlined"
          />
        </v-card-text>

        <v-card-actions class="px-6 pb-5 pt-2 ga-2">
          <v-spacer />
          <v-btn
            variant="text"
            @click="model = false"
          >
            Cancel
          </v-btn>
          <v-btn
            class="px-5"
            color="primary"
            prepend-icon="mdi-plus"
            type="submit"
            variant="flat"
          >
            Add rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import type { VForm } from 'vuetify/components'
import type { NewRocketInput } from '@/types/rocket'
import {
  buildNewRocketInput,
  createEmptyForm,
  type RocketFormValues,
  validateCountry,
  validateDescription,
  validateImageUrl,
  validateLaunchCost,
  validateMaidenFlight,
  validateName,
} from '@/utils/rocketForm'

const model = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  submit: [input: NewRocketInput]
}>()

const { xs } = useDisplay()

const formRef = ref<InstanceType<typeof VForm> | null>(null)
const form = ref<RocketFormValues>(createEmptyForm())

watch(model, async isOpen => {
  if (isOpen) {
    form.value = createEmptyForm()
    await nextTick()
    formRef.value?.resetValidation()
  }
})

async function onSubmit (): Promise<void> {
  if (!formRef.value) {
    return
  }
  const { valid } = await formRef.value.validate()
  if (!valid) {
    return
  }
  emit('submit', buildNewRocketInput(form.value))
}
</script>
