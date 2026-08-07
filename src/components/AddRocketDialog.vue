<template>
  <v-dialog
    v-model="open"
    max-width="620"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="primary"
        prepend-icon="mdi-plus"
      >
        Add rocket
      </v-btn>
    </template>
    <v-card title="Add rocket">
      <v-form
        ref="form"
        @submit.prevent="submit"
      >
        <v-card-text>
          <v-text-field
            v-model.trim="draft.full_name"
            label="Name *"
            :rules="[required]"
          />
          <v-textarea
            v-model.trim="draft.description"
            label="Description"
            rows="3"
          />
          <v-text-field
            v-model.trim="draft.image_url"
            label="Image URL"
            type="url"
          />
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model.trim="draft.launch_cost"
                label="Launch cost (USD)"
                :rules="[validCost]"
                type="number"
                min="0"
              />
            </v-col><v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="draft.maiden_flight"
                label="First flight"
                type="date"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model.trim="draft.country"
            label="Country code"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer /><v-btn @click="open = false">
            Cancel
          </v-btn><v-btn
            color="primary"
            type="submit"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { useRocketStore } from '@/stores/rockets'
const emit = defineEmits<{ added: [id: string] }>()
const store = useRocketStore(); const open = ref(false); const form = ref<VForm>()
const empty = () => ({ full_name: '', description: '', image_url: '', launch_cost: '', maiden_flight: '', country: '' })
const draft = reactive(empty()); const required = (value: string) => Boolean(value) || 'Name is required'
const validCost = (value: string) => value === '' || (Number.isFinite(Number(value)) && Number(value) >= 0) || 'Launch cost must be a nonnegative number'
async function submit () { const result = await form.value?.validate(); if (!result?.valid) return; const id = store.addRocket({ full_name: draft.full_name, description: draft.description || null, image_url: draft.image_url || null, launch_cost: draft.launch_cost || null, maiden_flight: draft.maiden_flight || null, country: draft.country || null }); Object.assign(draft, empty()); open.value = false; emit('added', id) }
</script>
