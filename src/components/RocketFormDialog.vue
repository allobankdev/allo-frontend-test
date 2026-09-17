<template>
  <v-dialog
    v-model="open"
    max-width="560"
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <span>Add rocket</span>
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="open = false"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form
          ref="formRef"
          @submit.prevent="submit"
        >
          <div class="d-flex flex-column ga-4">
            <v-text-field
              v-model="form.fullName"
              label="Name *"
              :rules="[rules.required]"
            />
            <v-textarea
              v-model="form.description"
              auto-grow
              label="Description"
              rows="3"
            />
            <v-text-field
              v-model="form.imageUrl"
              label="Image URL"
              :rules="[rules.url]"
            />
            <v-row dense>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="form.launchCost"
                  inputmode="numeric"
                  label="Cost per launch (USD)"
                  :rules="[rules.number]"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="form.countryCode"
                  label="Country code"
                  placeholder="USA"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="form.maidenFlight"
                  label="First flight"
                  type="date"
                />
              </v-col>
              <v-col
                class="d-flex align-center"
                cols="12"
                sm="6"
              >
                <v-checkbox
                  v-model="form.active"
                  density="compact"
                  hide-details
                  label="Active"
                />
              </v-col>
            </v-row>
          </div>
          <button
            class="d-none"
            type="submit"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="outlined"
          @click="open = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="submit"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue'
  import type { NewRocket } from '@/types/rocket'
  import type { VForm } from 'vuetify/components'

  const open = defineModel<boolean>({ required: true })
  const emit = defineEmits<{ submit: [rocket: NewRocket] }>()

  const createEmptyForm = (): NewRocket => ({
    fullName: '',
    description: '',
    imageUrl: '',
    launchCost: '',
    countryCode: '',
    maidenFlight: '',
    active: true,
  })

  const formRef = ref<VForm>()
  const form = reactive<NewRocket>(createEmptyForm())

  const rules = {
    required: (value: string) => !!value?.trim() || 'Name is required',
    url: (value: string) => !value || /^https?:\/\/\S+$/i.test(value) || 'Enter a valid http(s) URL',
    number: (value: string) => !value || /^\d+$/.test(value) || 'Enter a whole number',
  }

  watch(open, isOpen => {
    if (isOpen) {
      Object.assign(form, createEmptyForm())
      formRef.value?.resetValidation()
    }
  })

  async function submit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    emit('submit', { ...form })
    open.value = false
  }
</script>
