<template>
  <v-dialog
    v-model="open"
    max-width="560"
  >
    <v-card title="Add rocket">
      <v-form
        ref="formRef"
        @submit.prevent="submit"
      >
        <v-card-text class="d-flex flex-column ga-2">
          <v-text-field
            v-model="form.name"
            label="Name *"
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
          />
          <v-text-field
            v-model="form.launchCost"
            label="Cost per launch (USD)"
            :rules="[rules.cost]"
            type="number"
          />
          <v-text-field
            v-model="form.countryCode"
            label="Country code (e.g. USA)"
            :rules="[rules.country]"
          />
          <v-text-field
            v-model="form.maidenFlight"
            label="First flight"
            type="date"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="open = false">
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
  import { reactive, ref, watch } from 'vue'
  import { useRocketStore } from '@/stores/rocket'

  const open = defineModel<boolean>({ required: true })
  const emit = defineEmits<{ added: [] }>()

  const store = useRocketStore()
  const formRef = ref<{ validate: () => Promise<{ valid: boolean }>, reset: () => void } | null>(null)

  const emptyForm = () => ({ name: '', description: '', imageUrl: '', launchCost: '', countryCode: '', maidenFlight: '' })
  const form = reactive(emptyForm())

  // Reset form setiap dialog dibuka lagi.
  watch(open, isOpen => {
    if (isOpen) Object.assign(form, emptyForm())
  })

  const rules = {
    required: (v: string) => !!v?.trim() || 'Required',
    url: (v: string) => !v || /^https?:\/\/.+/i.test(v) || 'Must start with http:// or https://',
    cost: (v: string) => !v || Number(v) >= 0 || 'Cannot be negative',
    country: (v: string) => !v || /^[A-Za-z]{2,3}$/.test(v) || 'Use a 2–3 letter code',
  }

  async function submit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    store.addRocket({
      name: form.name.trim(),
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      launchCost: form.launchCost ? Number(form.launchCost) : null,
      countryCode: form.countryCode.trim().toUpperCase() || null,
      maidenFlight: form.maidenFlight || null,
    })
    open.value = false
    emit('added')
  }
</script>
