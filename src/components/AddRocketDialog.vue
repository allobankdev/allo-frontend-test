<template>
  <v-dialog
    v-model="open"
    max-width="600"
    scrollable
    @after-leave="resetForm"
  >
    <v-card>
      <v-card-item class="pa-6 pb-2">
        <template #prepend>
          <v-avatar
            color="primary"
            rounded="lg"
            variant="tonal"
          >
            <v-icon icon="mdi-rocket-launch-outline" />
          </v-avatar>
        </template>
        <v-card-title class="font-weight-bold">
          Add a rocket
        </v-card-title>
        <v-card-subtitle>
          Only the name is required. The rocket is kept for this session.
        </v-card-subtitle>
      </v-card-item>

      <v-card-text class="px-6">
        <v-form
          id="add-rocket-form"
          ref="formRef"
          @submit.prevent="submit"
        >
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                autofocus
                label="Name *"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                auto-grow
                label="Description"
                rows="3"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.imageUrl"
                label="Image URL"
                placeholder="https://…"
                prepend-inner-icon="mdi-image-outline"
                :rules="[rules.optionalUrl]"
                type="url"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.costPerLaunch"
                label="Cost per launch"
                min="0"
                prefix="$"
                :rules="[rules.optionalNonNegativeNumber]"
                type="number"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-combobox
                v-model="form.country"
                :items="countries"
                label="Country"
                placeholder="e.g. USA"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.firstFlight"
                label="First flight"
                type="date"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          text="Cancel"
          variant="text"
          @click="open = false"
        />
        <v-btn
          color="primary"
          form="add-rocket-form"
          text="Add rocket"
          type="submit"
          variant="flat"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { VForm } from 'vuetify/components'
  import type { NewRocketInput } from '@/types/rocket'

  defineProps<{
    countries: string[]
  }>()

  const emit = defineEmits<{
    submit: [rocket: NewRocketInput]
  }>()

  const open = defineModel<boolean>({ required: true })

  interface RocketForm {
    name: string
    description: string
    imageUrl: string
    costPerLaunch: string
    country: string | null
    firstFlight: string
  }

  function emptyForm (): RocketForm {
    return { name: '', description: '', imageUrl: '', costPerLaunch: '', country: null, firstFlight: '' }
  }

  const formRef = ref<VForm | null>(null)
  const form = reactive<RocketForm>(emptyForm())

  const rules = {
    required: (value: string) => !!value?.trim() || 'Required',
    optionalUrl: (value: string) => !value || URL.canParse(value) || 'Enter a valid URL',
    optionalNonNegativeNumber: (value: string) =>
      value === '' || Number(value) >= 0 || 'Enter a positive number',
  }

  function toOptional (value: string | null): string | null {
    return value?.trim() || null
  }

  function toInput (values: RocketForm): NewRocketInput {
    return {
      name: values.name.trim(),
      description: toOptional(values.description),
      imageUrl: toOptional(values.imageUrl),
      costPerLaunch: values.costPerLaunch === '' ? null : Number(values.costPerLaunch),
      country: toOptional(values.country)?.toUpperCase() ?? null,
      firstFlight: toOptional(values.firstFlight),
    }
  }

  async function submit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    emit('submit', toInput(form))
    open.value = false
  }

  function resetForm () {
    Object.assign(form, emptyForm())
    formRef.value?.resetValidation()
  }
</script>
