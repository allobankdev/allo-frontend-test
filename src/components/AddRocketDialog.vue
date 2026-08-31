<template>
  <v-dialog
    v-model="isOpen"
    max-width="560"
  >
    <v-card class="pa-4 bg-surface border-line">
      <v-card-title class="d-flex align-center justify-space-between text-h6 font-weight-bold pb-2 text-onSurface">
        <span>ADD ROCKET MANIFEST</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="close"
        />
      </v-card-title>

      <v-divider class="mb-4" />

      <v-form
        ref="formRef"
        @submit.prevent="submit"
      >
        <v-card-text class="pa-0">
          <div class="mb-3">
            <label class="spec-label d-block mb-1">ROCKET NAME *</label>
            <v-text-field
              v-model="form.fullName"
              placeholder="e.g. Falcon Heavy Block 5"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required]"
            />
          </div>

          <div class="mb-3">
            <label class="spec-label d-block mb-1">DESCRIPTION</label>
            <v-textarea
              v-model="form.description"
              placeholder="Brief operational spec or vehicle history..."
              variant="outlined"
              density="comfortable"
              rows="3"
            />
          </div>

          <v-row
            no-gutters
            class="ga-3 mb-3"
          >
            <v-col>
              <label class="spec-label d-block mb-1">COUNTRY CODE</label>
              <v-text-field
                v-model="form.country"
                placeholder="e.g. USA"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col>
              <label class="spec-label d-block mb-1">MAIDEN FLIGHT DATE</label>
              <v-text-field
                v-model="form.maidenFlight"
                type="date"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-row
            no-gutters
            class="ga-3 mb-3"
          >
            <v-col>
              <label class="spec-label d-block mb-1">LAUNCH COST ($)</label>
              <v-text-field
                v-model="form.launchCost"
                placeholder="e.g. $67,000,000"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col>
              <label class="spec-label d-block mb-1">IMAGE URL</label>
              <v-text-field
                v-model="form.imageUrl"
                placeholder="https://..."
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-0 pt-3 justify-end">
          <v-btn
            variant="outlined"
            class="text-none btn-cancel px-4"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="text-none px-4"
            type="submit"
          >
            Save rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: {
    fullName: string
    description?: string
    imageUrl?: string
    launchCost?: string
    country?: string
    maidenFlight?: string
  }): void
}>()

const isOpen = ref(props.modelValue)
const formRef = ref()

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val
  }
)

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

const form = ref({
  fullName: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  country: '',
  maidenFlight: '',
})

const rules = {
  required: (v: string) => !!v || 'Rocket name is required',
}

function formatCurrency(val: string): string {
  const digits = val.replace(/\D/g, '')
  if (!digits) return ''
  const num = Number(digits)
  return `$${num.toLocaleString('en-US')}`
}

watch(
  () => form.value.launchCost,
  (newVal) => {
    if (newVal === undefined || newVal === null) return
    const formatted = formatCurrency(newVal)
    if (formatted !== newVal) {
      form.value.launchCost = formatted
    }
  }
)

async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  emit('submit', {
    fullName: form.value.fullName,
    description: form.value.description || undefined,
    imageUrl: form.value.imageUrl || undefined,
    launchCost: form.value.launchCost || undefined,
    country: form.value.country || undefined,
    maidenFlight: form.value.maidenFlight || undefined,
  })

  // Reset form
  form.value = {
    fullName: '',
    description: '',
    imageUrl: '',
    launchCost: '',
    country: '',
    maidenFlight: '',
  }

  close()
}

function close() {
  isOpen.value = false
}
</script>
