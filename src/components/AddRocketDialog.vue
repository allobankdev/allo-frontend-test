<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card title="Add a rocket">
      <v-card-text>
        <v-form
          ref="form"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="draft.full_name"
            label="Rocket name *"
            :rules="requiredRules"
            variant="outlined"
          />
          <v-textarea
            v-model="draft.description"
            label="Description *"
            :rules="requiredRules"
            rows="3"
            variant="outlined"
          />
          <v-text-field
            v-model="draft.image_url"
            label="Image URL (optional)"
            type="url"
            variant="outlined"
          />
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="draft.launch_cost"
                label="Cost per launch (USD)"
                type="number"
                variant="outlined"
              />
            </v-col><v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="draft.maiden_flight"
                label="First flight"
                type="date"
                variant="outlined"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="draft.country_code"
            label="Country code"
            placeholder="USA"
            variant="outlined"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer /><v-btn @click="close">
          Cancel
        </v-btn><v-btn
          color="primary"
          variant="flat"
          @click="submit"
        >
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { NewRocket } from '@/types/rocket'

  defineProps<{ modelValue: boolean }>()
  const emit = defineEmits<{ 'update:modelValue': [value: boolean], add: [rocket: NewRocket] }>()
  const form = ref<{ validate: () => Promise<{ valid: boolean }> }>()
  const emptyDraft = (): Required<NewRocket> => ({ full_name: '', description: '', image_url: '', launch_cost: '', maiden_flight: '', country_code: '' })
  const draft = reactive(emptyDraft())
  const requiredRules = [(value: string) => !!value?.trim() || 'This field is required.']
  const close = () => { Object.assign(draft, emptyDraft()); emit('update:modelValue', false) }
  const submit = async () => {
    const result = await form.value?.validate()
    if (!result?.valid) return
    emit('add', { ...draft })
    close()
  }
</script>
