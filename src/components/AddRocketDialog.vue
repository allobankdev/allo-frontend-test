<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>Add a new rocket</v-card-title>
      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="onSubmit"
        >
          <v-text-field
            v-model="form.full_name"
            label="Rocket name *"
            :rules="[rules.required]"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
          />
          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.family"
                label="Family"
                placeholder="Falcon"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-select
                v-model="form.active"
                :items="activeOptions"
                label="Status"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Launch cost (USD)"
                placeholder="52000000"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.maiden_flight"
                label="First flight"
                type="date"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="form.country_code"
            label="Country code"
            placeholder="USA"
          />
          <v-text-field
            v-model="form.image_url"
            label="Image URL (optional)"
            placeholder="https://…"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="onSubmit"
        >
          Save rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import type { LocalRocketInput } from '@/types/rocket'

const props = withDefaults(defineProps<{ modelValue?: boolean }>(), {
  modelValue: false,
})
void props

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [input: LocalRocketInput]
}>()

const formRef = ref<VForm | null>(null)

const form = reactive({
  full_name: '',
  description: '',
  family: '',
  active: null as boolean | null,
  launch_cost: '',
  maiden_flight: '',
  country_code: '',
  image_url: '',
})

const rules = {
  required: (value: string) => (value?.trim() ? true : 'Name is required.'),
}

const activeOptions = [
  { title: 'Unknown', value: null },
  { title: 'Active', value: true },
  { title: 'Inactive', value: false },
]

function close () {
  emit('update:modelValue', false)
}

async function onSubmit () {
  const result = await formRef.value?.validate()
  if (result && !result.valid) return
  if (!form.full_name.trim()) return
  const payload: LocalRocketInput = {
    full_name: form.full_name.trim(),
    description: form.description.trim() || null,
    family: form.family.trim() || null,
    active: form.active,
    launch_cost: form.launch_cost.trim() || null,
    maiden_flight: form.maiden_flight || null,
    country_code: form.country_code.trim() || null,
    image_url: form.image_url.trim() || null,
  }
  emit('submit', payload)
  close()
}
</script>
