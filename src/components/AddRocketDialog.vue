<template>
  <v-dialog
    v-model="open"
    max-width="560"
  >
    <v-card title="Add new rocket">
      <v-form
        ref="formRef"
        @submit.prevent="submit"
      >
        <v-card-text>
          <v-text-field
            v-model="form.name"
            label="Name *"
            :rules="[required]"
          />
          <v-textarea
            v-model="form.description"
            auto-grow
            label="Description"
            rows="2"
          />
          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            :rules="[urlRule]"
          />
          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launchCost"
                label="Cost per launch (USD)"
                min="0"
                :rules="[nonNegative]"
                type="number"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country"
                label="Country code"
                maxlength="3"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="form.firstFlight"
            label="First flight"
            type="date"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="open = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            variant="flat"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue'
  import type { NewRocketInput } from '@/types/rocket'

  const open = defineModel<boolean>({ default: false })
  const emit = defineEmits<{ submit: [rocket: NewRocketInput] }>()

  const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

  const emptyForm = () => ({
    name: '',
    description: '',
    imageUrl: '',
    launchCost: '',
    country: '',
    firstFlight: '',
  })
  const form = reactive(emptyForm())

  watch(open, isOpen => { if (isOpen) Object.assign(form, emptyForm()) })

  const required = (v: string) => !!v?.trim() || 'Name is required'
  const urlRule = (v: string) => !v || /^https?:\/\/.+/i.test(v) || 'Must be a valid URL'
  const nonNegative = (v: string) => v === '' || Number(v) >= 0 || 'Must be a positive number'

  async function submit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return
    emit('submit', {
      name: form.name.trim(),
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      launchCost: form.launchCost === '' ? null : Number(form.launchCost),
      country: form.country.trim().toUpperCase() || null,
      firstFlight: form.firstFlight || null,
    })
    open.value = false
  }
</script>

