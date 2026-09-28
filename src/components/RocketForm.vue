<script lang="ts" setup>
  import { reactive } from 'vue'
  import type { NewRocketInput } from '@/types/rocket'

  const emit = defineEmits<{ submit: [input: NewRocketInput], cancel: [] }>()

  const form = reactive({
    name: '',
    description: '',
    image: '',
    costPerLaunch: 0,
    country: '',
    firstFlight: '',
  })

  const rules = {
    required: (value: string) => !!value || 'This field is required',
  }

  function onSubmit () {
    emit('submit', {
      ...form,
      image: form.image || 'https://placehold.co/600x400?text=No+Image',
      costPerLaunch: Number(form.costPerLaunch),
    })
  }
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-card-text>
      <v-text-field
        v-model="form.name"
        label="Name"
        :rules="[rules.required]"
      />
      <v-textarea
        v-model="form.description"
        label="Description"
        :rules="[rules.required]"
      />
      <v-text-field
        v-model="form.image"
        label="Image URL"
      />
      <v-text-field
        v-model.number="form.costPerLaunch"
        label="Cost per launch (USD)"
        min="0"
        :rules="[rules.required]"
        type="number"
      />
      <v-text-field
        v-model="form.country"
        label="Country"
        :rules="[rules.required]"
      />
      <v-text-field
        v-model="form.firstFlight"
        label="First flight"
        type="date"
        :rules="[rules.required]"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('cancel')">
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
</template>
