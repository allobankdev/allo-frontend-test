<template>
  <v-dialog
    v-model="model"
    :fullscreen="xs"
    max-width="600"
  >
    <v-card>
      <v-card-title class="text-h6 font-weight-bold pt-4 px-6">
        Add rocket
      </v-card-title>

      <v-form
        ref="formRef"
        @submit.prevent="onSubmit"
      >
        <v-card-text class="px-6">
          <v-text-field
            v-model="form.name"
            autofocus
            class="mb-2"
            counter="100"
            label="Rocket name *"
            :rules="[validateName]"
            variant="outlined"
          />

          <v-textarea
            v-model="form.description"
            class="mb-2"
            counter="1000"
            label="Description"
            rows="3"
            :rules="[validateDescription]"
            variant="outlined"
          />

          <v-text-field
            v-model="form.imageUrl"
            class="mb-2"
            label="Image URL"
            placeholder="https://example.com/rocket.jpg"
            :rules="[validateImageUrl]"
            variant="outlined"
          />

          <v-text-field
            v-model="form.launchCost"
            class="mb-2"
            inputmode="decimal"
            label="Launch cost (USD)"
            prefix="$"
            :rules="[validateLaunchCost]"
            variant="outlined"
          />

          <v-text-field
            v-model="form.country"
            class="mb-2"
            label="Country"
            :rules="[validateCountry]"
            variant="outlined"
          />

          <v-text-field
            v-model="form.maidenFlight"
            label="First flight"
            :rules="[validateMaidenFlight]"
            type="date"
            variant="outlined"
          />
        </v-card-text>

        <v-card-actions class="px-6 pb-4">
          <v-spacer />
          <v-btn
            variant="text"
            @click="model = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
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
