<template>
  <v-form @submit.prevent="onSubmit">
    <v-card
      class="mb-6"
      variant="outlined"
      flat
    >
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="name"
              label="Name"
              variant="outlined"
              required
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="country"
              label="Country"
              variant="outlined"
              required
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="firstFlight"
              label="First flight (YYYY-MM-DD)"
              variant="outlined"
              required
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="costPerLaunch"
              label="Cost per launch (USD)"
              type="number"
              variant="outlined"
              required
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="description"
              label="Description"
              variant="outlined"
              rows="2"
              auto-grow
              required
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="imageUrl"
              label="Image URL (optional)"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          type="button"
          variant="text"
          @click="$emit('cancel')"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          type="submit"
          color="primary"
          :disabled="!canSubmit"
        >
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts" setup>
  //
  import { computed, ref } from 'vue'

  interface NewRocketPayload {
    name: string
    description: string
    country: string
    firstFlight: string
    costPerLaunch: number
    imageUrl?: string
  }

  const emit = defineEmits<{
    (e: 'submit', payload: NewRocketPayload): void
    (e: 'cancel'): void
  }>()

  const name = ref('')
  const description = ref('')
  const country = ref('')
  const firstFlight = ref('')
  const costPerLaunch = ref('')
  const imageUrl = ref('')

  const canSubmit = computed(() => {
    const hasRequiredText =
      name.value.trim() &&
      description.value.trim() &&
      country.value.trim() &&
      firstFlight.value.trim() &&
      costPerLaunch.value.trim()

    const cost = Number(costPerLaunch.value)

    return Boolean(hasRequiredText && Number.isFinite(cost) && cost >= 0)
  })

  const reset = () => {
    name.value = ''
    description.value = ''
    country.value = ''
    firstFlight.value = ''
    costPerLaunch.value = ''
    imageUrl.value = ''
  }

  const onSubmit = () => {
    if (!canSubmit.value) return

    const cost = Number(costPerLaunch.value)

    emit('submit', {
      name: name.value.trim(),
      description: description.value.trim(),
      country: country.value.trim(),
      firstFlight: firstFlight.value.trim(),
      costPerLaunch: cost,
      imageUrl: imageUrl.value.trim() || undefined,
    })

    reset()
  }
</script>
