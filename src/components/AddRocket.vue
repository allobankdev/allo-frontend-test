<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{props: activatorProps}">
        <v-btn class="text-none font-weight-regular" prepend-icon="mdi-plus" text="Add New Rocket" variant="tonal"
          v-bind="activatorProps"></v-btn>
      </template>

      <v-card prepend-icon="mdi-rocket" title="Add New Rocket">
        <v-form v-model="valid" ref="formRef">
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-text-field v-model="rocketItem.name" label="Name*" :rules="[rules.required]" />
              </v-col>

              <v-col cols="12">
                <v-autocomplete v-model="rocketItem.country" :items="rocket.countries" label="Country*"
                  :rules="[rules.required]" />
              </v-col>

              <v-col cols="12">
                <v-text-field v-model.number="rocketItem.cost_per_launch" label="Cost per launch*" type="number"
                  :rules="[rules.required, rules.positive]" />
              </v-col>

              <v-col cols="12">
                <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition">
                  <template #activator="{props}">
                    <v-text-field v-model="formattedDate" label="First Flight*" readonly v-bind="props"
                      :rules="[rules.required]" prepend-inner-icon="mdi-calendar" />
                  </template>

                  <v-date-picker v-model="selectedDate" @update:model-value="onDateSelected" />
                </v-menu>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="rocketItem.image" label="Image Url" hint="Random image if empty"
                  persistent-hint />
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="rocketItem.description" label="Description*" :rules="[rules.required]" />
              </v-col>
            </v-row>

            <small class="text-caption text-medium-emphasis">
              * indicates required field
            </small>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn variant="plain" @click="close">Close</v-btn>
            <v-btn color="primary" variant="tonal" :disabled="!valid" @click="submit">
              Add
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>

    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref, shallowRef} from 'vue'
import {useRocketStore} from '@/stores/useRocketStore'
import type {CreateRocketPayload} from '@/types/api/RocketPayload'
import {formatDate} from '@/utils/textUtil'

const rocket = useRocketStore()
const dialog = shallowRef(false)
const valid = ref(false)
const formRef = ref()

const dateMenu = ref(false)
const selectedDate = ref<string | null>(null)

const rocketItem = reactive<CreateRocketPayload>({
  name: '',
  country: null,
  cost_per_launch: null,
  first_flight: '',
  description: '',
  image: '',
})

const rules = {
  required: (v: any) => !!v || 'This field is required',
  positive: (v: number) => (v && v > 0) || 'Must be greater than 0',
}

const resetForm = () => {
  Object.assign(rocketItem, {
    name: '',
    country: null,
    cost_per_launch: null,
    first_flight: '',
    description: '',
    image: '',
  })

  selectedDate.value = null
  dateMenu.value = false
}

const submit = async () => {
  const {valid: isValid} = await formRef.value.validate()
  if (!isValid) return

  rocket.addRocket(rocketItem)

  resetForm()

  dialog.value = false
}

const formattedDate = computed(() =>
  rocketItem.first_flight
    ? formatDate(rocketItem.first_flight)
    : ''
)

const onDateSelected = (value: string | null) => {
  if (!value) return

  rocketItem.first_flight = value
  dateMenu.value = false
}


const close = () => {
  formRef.value.reset()
  dialog.value = false
}
</script>
