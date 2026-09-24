<template>
  <v-dialog
    v-model="isOpen"
    max-width="600"
    @after-leave="resetForm"
  >
    <v-card title="Add a rocket">
      <v-form
        ref="formRef"
        @submit.prevent="submit"
      >
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            The rocket is kept in memory for this session only and is not sent to the API.
          </p>

          <v-text-field
            v-model="form.name"
            autofocus
            label="Rocket name *"
            :rules="[rules.required]"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
          />
          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            :rules="[rules.url]"
            type="url"
          />
          <v-text-field
            v-model="form.launchCost"
            label="Cost per launch (USD)"
            min="0"
            :rules="[rules.cost]"
            type="number"
          />
          <v-text-field
            v-model="form.country"
            label="Country"
          />
          <v-text-field
            v-model="form.firstFlight"
            label="First flight"
            :rules="[rules.date]"
            type="date"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            text="Cancel"
            @click="isOpen = false"
          />
          <v-btn
            color="primary"
            text="Add rocket"
            type="submit"
            variant="flat"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { VForm } from 'vuetify/components'
  import type { NewRocketInput } from '@/types/rocket'
  import { cleanText, isHttpUrl, parseCost, parseDate } from '@/utils/parsers'

  /** Raw input values; text fields always give strings. */
  interface RocketForm {
    name: string
    description: string
    imageUrl: string
    launchCost: string
    country: string
    firstFlight: string
  }

  const isOpen = defineModel<boolean>({ required: true })

  const emit = defineEmits<{
    create: [rocket: NewRocketInput]
  }>()

  const formRef = ref<VForm | null>(null)

  function createEmptyForm (): RocketForm {
    return { name: '', description: '', imageUrl: '', launchCost: '', country: '', firstFlight: '' }
  }

  const form = reactive<RocketForm>(createEmptyForm())

  // A Vuetify rule returns `true` when valid, or the error message to show.
  // Optional fields are only checked when something was entered.
  const rules = {
    required: (value: string | null) => !!cleanText(value) || 'Rocket name is required',
    url: (value: string | null) => {
      const url = cleanText(value)
      return !url || isHttpUrl(url) || 'Enter a valid http(s) URL'
    },
    cost: (value: string | null) => !cleanText(value) || parseCost(value) !== null || 'Enter a non-negative number',
    date: (value: string | null) => !cleanText(value) || parseDate(value) !== null || 'Enter a valid date',
  }

  function toNewRocketInput (values: RocketForm): NewRocketInput {
    return {
      name: values.name.trim(),
      description: cleanText(values.description),
      imageUrl: cleanText(values.imageUrl),
      launchCost: parseCost(cleanText(values.launchCost)),
      country: cleanText(values.country),
      firstFlight: cleanText(values.firstFlight),
    }
  }

  async function submit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    emit('create', toNewRocketInput(form))
    isOpen.value = false
  }

  // Called after the close animation, so the fields don't visibly clear while fading out.
  function resetForm () {
    Object.assign(form, createEmptyForm())
    formRef.value?.resetValidation()
  }
</script>
