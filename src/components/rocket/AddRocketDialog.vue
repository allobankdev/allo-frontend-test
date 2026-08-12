<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card
      rounded="xl"
      class="add-dialog-card"
    >
      <div class="dialog-header pa-6 pb-4">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar
              color="primary"
              variant="tonal"
              size="40"
              class="mr-3"
            >
              <v-icon icon="mdi-rocket-launch" />
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">Add New Rocket</div>
              <div class="text-caption text-medium-emphasis">
                Rocket will only appear in this app session
              </div>
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            density="comfortable"
            @click="$emit('update:modelValue', false)"
          />
        </div>
      </div>

      <v-divider />

      <v-card-text class="pa-6">
        <form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.full_name"
            label="Rocket Name"
            placeholder="e.g. Falcon 9 Block 5"
            variant="outlined"
            prepend-inner-icon="mdi-rocket"
            class="mb-4"
            autofocus
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            placeholder="Brief description about this rocket"
            variant="outlined"
            prepend-inner-icon="mdi-text-long"
            rows="3"
            auto-grow
            class="mb-4"
          />

          <v-text-field
            v-model="form.image_url"
            label="Image URL (optional)"
            placeholder="https://..."
            variant="outlined"
            prepend-inner-icon="mdi-image"
            class="mb-4"
          />

          <div class="text-overline text-medium-emphasis mb-2">
            Additional details
          </div>

          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Launch Cost (USD)"
                placeholder="7000000"
                variant="outlined"
                prepend-inner-icon="mdi-currency-usd"
                :rules="[(v: string) => !v || !isNaN(Number(v)) || 'Must be a number']"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                label="Country Code"
                placeholder="US, ID"
                variant="outlined"
                prepend-inner-icon="mdi-earth"
                maxlength="2"
              />
            </v-col>
          </v-row>

          <VDateInput
            v-model="maidenFlightDate"
            label="First Flight"
            variant="outlined"
            :display-format="(d: Date) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(d)"
            class="mt-1"
          />
        </form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          size="large"
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          prepend-icon="mdi-check"
          @click="handleSubmit"
        >
          Save Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import type { NewRocketPayload } from '@/types/rocket'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: NewRocketPayload]
}>()

const maidenFlightDate = ref<Date | null>(null)

const form = reactive<NewRocketPayload>({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  maiden_flight: '',
  country_code: '',
})

function handleSubmit() {
  emit('submit', { ...form, maiden_flight: maidenFlightDate.value?.toISOString().slice(0, 10) ?? '' })

  Object.assign(form, {
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    maiden_flight: '',
    country_code: '',
  })
  maidenFlightDate.value = null
  emit('update:modelValue', false)
}
</script>

<style scoped>
.add-dialog-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.08) 0%,
    transparent 100%
  );
}
</style>