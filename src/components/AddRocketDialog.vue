<template>
  <v-dialog :model-value="true" max-width="480" @update:model-value="value => !value && $emit('close')">
    <v-card>
      <v-card-title>Add a rocket</v-card-title>
      <v-card-subtitle class="text-wrap pb-2">
        This won't be saved to the rocket database — it will only appear in this running app.
      </v-card-subtitle>

      <v-form @submit.prevent="handleSubmit">
        <v-card-text class="d-flex flex-column ga-1">
          <v-text-field
            v-model.trim="form.fullName"
            label="Name *"
            placeholder="e.g. Starship"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'Name is required']"
          />
          <v-textarea
            v-model.trim="form.description"
            label="Description"
            placeholder="What makes it fly?"
            variant="outlined"
            density="comfortable"
            rows="3"
          />
          <v-text-field
            v-model.trim="form.imageUrl"
            label="Image URL"
            type="url"
            placeholder="https://…"
            variant="outlined"
            density="comfortable"
          />
          <div class="d-flex ga-3">
            <v-text-field
              v-model.trim="form.launchCost"
              label="Cost per launch (USD)"
              type="number"
              min="0"
              variant="outlined"
              density="comfortable"
            />
            <v-text-field
              v-model.trim="form.countryCode"
              label="Country code"
              placeholder="e.g. USA"
              maxlength="3"
              variant="outlined"
              density="comfortable"
            />
          </div>
          <v-text-field
            v-model.trim="form.maidenFlight"
            label="First flight"
            type="date"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn variant="text" @click="$emit('close')">Cancel</v-btn>
          <v-btn color="primary" variant="flat" type="submit" :disabled="!form.fullName">
            Add rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { NewRocketInput } from '@/stores/rocketStore'

const emit = defineEmits<{ close: []; submit: [payload: NewRocketInput] }>()

const form = reactive<NewRocketInput>({
  fullName: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  countryCode: '',
  maidenFlight: '',
})

function handleSubmit () {
  if (!form.fullName.trim()) return
  emit('submit', { ...form })
}
</script>
