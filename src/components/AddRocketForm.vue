<template>
  <v-card
    class="my-8"
    variant="outlined"
  >
    <v-card-title>
      Add New Rocket
    </v-card-title>

    <v-card-text>
      <!-- <v-form @submit.prevent="submitForm"> -->
      <v-form
        ref="formRef"
        @submit.prevent="submitForm"
      >
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="form.full_name"
              label="Rocket name"
              variant="outlined"
              :rules="[required]"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="form.image_url"
              label="Image URL"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="Description"
              variant="outlined"
              rows="3"
              :rules="[required]"
            />
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="form.launch_cost"
              label="Launch cost"
              variant="outlined"
              type="number"
            />
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="form.country"
              label="Country code"
              variant="outlined"
              placeholder="USA"
            />
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="form.maiden_flight"
              label="First flight"
              variant="outlined"
              type="date"
            />
          </v-col>
        </v-row>

        <div class="d-flex justify-end ga-3">
          <v-btn
            variant="text"
            @click="clearForm"
          >
            Clear
          </v-btn>

          <v-btn
            color="primary"
            type="submit"
          >
            Add Rocket
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, ref } from 'vue'

  import { useRocketStore } from '@/stores/rocket'
  import type { Rocket } from '@/types/rocket'

  const rocketStore = useRocketStore()
  const formRef = ref()

  const form = reactive({
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    country: '',
    maiden_flight: '',
  })

  const required = (value: string) =>
    Boolean(value?.trim()) || 'This field is required.'

  function resetForm() {
    form.full_name = ''
    form.description = ''
    form.image_url = ''
    form.launch_cost = ''
    form.country = ''
    form.maiden_flight = ''
  }

  async function clearForm() {
    resetForm()

    await nextTick()
    formRef.value.resetValidation()
  }

  async function submitForm() {
    const { valid } = await formRef.value.validate()

    if (!valid) {
      return
    }

    const rocket: Rocket = {
      id: `local-${Date.now()}`,
      full_name: form.full_name.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
      launch_cost: form.launch_cost || null,
      maiden_flight: form.maiden_flight || null,
      manufacturer: {
        country_code: form.country.trim() || null,
      },
    }

    rocketStore.addRocket(rocket)
    resetForm()

    await nextTick()
    formRef.value.resetValidation()
  }
</script>