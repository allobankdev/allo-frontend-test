<template>
  <v-card prepend-icon="mdi-rocket" title="Rocket Add Form">
    <v-card-text>

      <v-form ref="formRef">
        <v-row>
          <v-col>
            <v-text-field label="Name" v-model="name" :rules="rules" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-number-input
              label="Cost Per Launch"
              v-model="costPerLaunch"
              :rules="rules"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field label="Country" v-model="country" :rules="rules" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              label="First Flight"
              v-model="firstFlight"
              type="date"
              :rules="rules"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-textarea
              label="Description"
              v-model="description"
              :rules="rules"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-file-input
              label="Images"
              multiple
              accept="image/png, image/jpeg, image/bmp"
              v-model="images"
              :rules="fileRules"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn color="primary" @click="submitForm">
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useRocket } from '@/composables/rocket'

const rocketStore = useRocket()
const formRef = ref()

const name = ref('')
const costPerLaunch = ref(0)
const country = ref('')
const firstFlight = ref('')
const description = ref('')
const images = ref<File[] | null>(null)

const rules = [
  (value: any) => !!value || 'Field is required!'
]

const fileRules = [
  (files: File[] | null) =>
    files && files.length > 0 || 'At least one image is required'
]

const submitForm = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) return

  rocketStore.addRocket({
    id: uuidv4(),
    name: name.value,
    description: description.value,
    country: country.value,
    cost_per_launch: costPerLaunch.value,
    first_flight: firstFlight.value,
    flickr_images: images.value
  })
}
</script>
