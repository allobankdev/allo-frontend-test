<script setup lang="ts">
    import { reactive } from 'vue'

    const emit = defineEmits<{
        (e: 'submit', payload: {
        name: string
        description: string
        country: string
        costPerLaunch: number
        firstFlight: string
        images: string[]
        }): void
    }>()
    
    const form = reactive({
        name: '',
        description: '',
        country: '',
        costPerLaunch: 0,
        firstFlight: '',
        imageUrl: '',
    })
    
    function onSubmit() {
        if (!form.name || !form.description) return

        emit('submit', {
            name: form.name,
            description: form.description,
            country: form.country || 'Unknown',
            costPerLaunch: form.costPerLaunch || 0,
            firstFlight: form.firstFlight || 'N/A',
            images: form.imageUrl ? [form.imageUrl] : [],
        })

        form.name = ''
        form.description = ''
        form.country = ''
        form.costPerLaunch = 0
        form.firstFlight = ''
        form.imageUrl = ''
    }
</script>
    
<template>
  <v-card class="pa-4 mb-4">
    <h2 class="text-h6 mb-4">
      Add New Rocket
    </h2>
    <v-form @submit.prevent="onSubmit">
      <v-row dense>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="form.name"
            label="Name"
            required
          />
        </v-col>
        <v-col
          cols="12"
          md="8"
        >
          <v-text-field
            v-model="form.description"
            label="Description"
            required
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="form.country"
            label="Country"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model.number="form.costPerLaunch"
            type="number"
            label="Cost per launch"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="form.firstFlight"
            label="First flight (YYYY-MM-DD)"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
          />
        </v-col>
        <v-col
          cols="12"
          class="d-flex justify-end"
        >
          <v-btn
            type="submit"
            color="primary"
          >
            Add Rocket
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
    