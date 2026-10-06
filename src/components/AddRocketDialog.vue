<template>
  <v-dialog
    v-model="open"
    max-width="640"
  >
    <v-card>
      <v-card-title class="pt-6 px-6">
        Add a rocket
      </v-card-title>
      <v-card-text class="px-6">
        <p class="mb-5 text-medium-emphasis">
          New rockets stay available until this browser session ends.
        </p>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="form.name"
            autocomplete="off"
            label="Rocket name"
            :rules="requiredRules"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            :rules="requiredRules"
            rows="3"
          />
          <v-text-field
            v-model="form.imageUrl"
            label="Image URL (optional)"
            type="url"
          />
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launchCost"
                label="Cost per launch (optional)"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country"
                label="Country (optional)"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="form.firstFlight"
            label="First flight (optional)"
            type="date"
          />
          <p
            v-if="validationMessage"
            class="text-error"
            role="alert"
          >
            {{ validationMessage }}
          </p>
          <div class="dialog-actions">
            <v-btn
              min-height="44"
              variant="text"
              @click="open = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              min-height="44"
              type="submit"
            >
              Add rocket
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { NewRocketInput } from '@/types/rocket'

const open = defineModel<boolean>({ default: false })
const emit = defineEmits<{ add: [rocket: NewRocketInput] }>()
const form = reactive<Required<NewRocketInput>>({ name: '', description: '', imageUrl: '', launchCost: '', country: '', firstFlight: '' })
const validationMessage = ref('')
const requiredRules = [(value: string) => Boolean(value?.trim()) || 'This field is required.']

function resetForm () {
  Object.assign(form, { name: '', description: '', imageUrl: '', launchCost: '', country: '', firstFlight: '' })
  validationMessage.value = ''
}

function submit () {
  if (!form.name.trim() || !form.description.trim()) {
    validationMessage.value = 'Enter both a rocket name and description before saving.'
    return
  }

  emit('add', { ...form })
  resetForm()
  open.value = false
}
</script>

<style scoped>
.dialog-actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; margin-top: 12px; }
</style>
