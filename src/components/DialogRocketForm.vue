<script setup lang='ts'>
import { useField, useFieldArray, useForm } from "vee-validate"
import { toTypedSchema } from '@vee-validate/zod'
import { z } from "zod"
import { nextTick } from "vue";

defineProps<{
  disabled?: boolean
}>()

const zodSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  description: z.string().min(1, { error: "Description is required" }),
  country: z.string().min(1, { error: "Country is required" }),
  cost_per_launch: z.number({ error: "Cost per Launch is required" }),
  first_flight: z.date({ error: "First Flight is required" }),
  flickr_images: z.array(z.url({ error: "Invalid URL" }))
})

const schema = toTypedSchema(zodSchema)

type Schema = z.infer<typeof zodSchema>

const { handleSubmit, handleReset, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    flickr_images: [""]
  },
})

const name = useField<string>("name")
const description = useField<string>("description")
const country = useField<string>("country")
const costPerLaunch = useField<number>("cost_per_launch")
const firstFlight = useField<string>("first_flight")
const { fields, push, remove } = useFieldArray("flickr_images")

const emit = defineEmits<{
  submit: [payload: Schema]
}>()

const onSubmit = handleSubmit((values) => {
  emit("submit", values)
  nextTick(handleReset)
})
</script>

<template>
  <v-dialog max-width="600">
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        :disabled="disabled"
      >
        Add New Rocket
      </v-btn>
    </template>
    <template #default>
      <v-form @submit.prevent="onSubmit">
        <v-card title="Rocket Form">
          <v-card-text>
            <v-text-field
              v-model="name.value.value"
              :error-messages="name.errorMessage.value"
              label="Name"
            />
            <v-textarea
              v-model="description.value.value"
              :error-messages="description.errorMessage.value"
              label="Description"
            />
            <v-text-field
              v-model="country.value.value"
              :error-messages="country.errorMessage.value"
              label="Country"
            />
            <v-number-input
              v-model="costPerLaunch.value.value"
              :error-messages="costPerLaunch.errorMessage.value"
              label="Cost per Launch"
            />
            <v-date-input
              v-model="firstFlight.value.value"
              :error-messages="firstFlight.errorMessage.value"
              prepend-icon=""
              prepend-inner-icon="$calendar"
              label="First Flight"
              input-format="dd/mm/yyyy"
            />
            <div>
              <div
                v-for="(field, idx) in fields"
                :key="idx"
                class="d-flex ga-2"
              >
                <v-text-field
                  v-model="field.value"
                  :error-messages="errors[`flickr_images[${idx}]`]"
                  :label="`Image URL (${idx + 1})`"
                />
                <v-btn
                  v-if="fields.length > 1"
                  icon="mdi-close"
                  variant="tonal"
                  style="border-radius: 0.25rem;"
                  @click="remove"
                />
              </div>
              <v-btn
                variant="tonal"
                @click="push('')"
              >
                Add Image
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="handleReset"
            >
              Reset
            </v-btn>
            <v-btn
              type="submit"
              variant="tonal"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </template>
  </v-dialog>
</template>