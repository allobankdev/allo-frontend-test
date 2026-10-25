<!--
  Dialog with a validated form for adding a rocket locally. Emits nothing; it writes
  straight to the store via addRocket and closes on success.
-->
<template>
  <v-dialog
    v-model="open"
    max-width="560"
  >
    <template #activator="{ props: activator }">
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        v-bind="activator"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card title="Add a new rocket">
      <v-form
        ref="formRef"
        @submit.prevent="submit"
      >
        <v-card-text>
          <v-text-field
            v-model="form.name"
            label="Name"
            :rules="[required]"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
            :rules="[required]"
          />
          <v-text-field
            v-model="form.imageUrl"
            hint="Optional"
            label="Image URL"
            persistent-hint
          />
          <v-text-field
            v-model.number="form.cost_per_launch"
            label="Cost per launch (USD)"
            :rules="[required, nonNegative]"
            type="number"
          />
          <v-text-field
            v-model="form.country"
            label="Country"
            :rules="[required]"
          />
          <v-text-field
            v-model="form.first_flight"
            label="First flight"
            :rules="[required]"
            type="date"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="open = false">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            variant="flat"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useRocketsStore } from '@/stores/rockets'
  import type { NewRocketInput } from '@/types/rocket'

  const store = useRocketsStore()

  const open = ref(false)
  const formRef = ref()

  function blankForm (): NewRocketInput {
    return {
      name: '',
      description: '',
      imageUrl: '',
      cost_per_launch: 0,
      country: '',
      first_flight: '',
    }
  }

  const form = reactive<NewRocketInput>(blankForm())

  const required = (v: unknown) => (!!v || v === 0 ? true : 'Required')
  const nonNegative = (v: number) => (v >= 0 ? true : 'Must be zero or more')

  async function submit () {
    const { valid } = await formRef.value.validate()
    if (!valid) return
    store.addRocket({ ...form })
    Object.assign(form, blankForm())
    formRef.value.resetValidation()
    open.value = false
  }
</script>
