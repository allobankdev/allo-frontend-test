<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRocketStore } from '@/stores/rockets'

const open = defineModel<boolean>({ required: true })
const store = useRocketStore()

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const isSaving = ref(false)

const form = ref({
    name: '',
    description: '',
    imageUrl: '',
    country: '',
    costPerLaunch: '',
    firstFlight: '',
})

function resetForm(): void {
    form.value = {
        name: '',
        description: '',
        imageUrl: '',
        country: '',
        costPerLaunch: '',
        firstFlight: '',
    }
}

watch(open, (isOpen) => {
    if (isOpen) resetForm()
})

const nameRules = [
    (value: string) => (value?.trim().length ?? 0) >= 3 || 'Name must be at least 3 characters.',
]

const descriptionRules = [
    (value: string) =>
        (value?.trim().length ?? 0) >= 10 || 'Description must be at least 10 characters.',
]

const imageUrlRules = [
    (value: string) => !value || /^https?:\/\/.+/.test(value) || 'Must start with http:// or https://',
]

const costRules = [
    (value: string) =>
        !value || (Number.isFinite(Number(value)) && Number(value) >= 0) || 'Must be a positive number',
]

async function submit(): Promise<void> {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    isSaving.value = true

    try {
        store.addRocket({
            name: form.value.name,
            description: form.value.description,
            imageUrl: form.value.imageUrl || null,
            country: form.value.country || null,
            costPerLaunch: form.value.costPerLaunch ? Number(form.value.costPerLaunch) : null,
            firstFlight: form.value.firstFlight || null,
        })
        open.value = false
    } finally {
        isSaving.value = false
    }
}
</script>

<template>
  <v-dialog
    v-model="open"
    max-width="620"
    scrollable
  >
    <v-card>
      <v-card-title class="pt-5">
        Add a rocket
      </v-card-title>
      <v-card-subtitle>
        The Launch Library API is read-only, so this rocket lives in the running app only.
      </v-card-subtitle>

      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="form.name"
            label="Name *"
            :rules="nameRules"
            variant="outlined"
            density="comfortable"
            class="mb-1"
          />

          <v-textarea
            v-model="form.description"
            label="Description *"
            :rules="descriptionRules"
            variant="outlined"
            density="comfortable"
            rows="3"
            auto-grow
            class="mb-1"
          />

          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            :rules="imageUrlRules"
            placeholder="https://..."
            variant="outlined"
            density="comfortable"
            class="mb-1"
          />

          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country"
                label="Country"
                placeholder="USA"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.costPerLaunch"
                label="Cost per launch (USD)"
                :rules="costRules"
                placeholder="52000000"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.firstFlight"
                label="First flight"
                type="date"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="open = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="isSaving"
          @click="submit"
        >
          Save rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
