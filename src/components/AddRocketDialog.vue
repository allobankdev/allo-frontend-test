<template>
  <v-dialog
    v-model="open"
    max-width="520"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        class="add-rocket-btn"
        color="primary"
        prepend-icon="mdi-plus"
        rounded="0"
        variant="flat"
        v-bind="activatorProps"
      >
        Add rocket
      </v-btn>
    </template>

    <v-card rounded="0">
      <v-card-title class="display-heading pt-6 px-6">
        Add a rocket
      </v-card-title>

      <v-form
        ref="formRef"
        @submit.prevent="submit"
      >
        <v-card-text class="px-6">
          <v-text-field
            v-model="form.full_name"
            class="mb-2"
            label="Name"
            :rules="[required]"
            variant="underlined"
          />
          <v-textarea
            v-model="form.description"
            class="mb-2"
            label="Description"
            rows="3"
            variant="underlined"
          />
          <v-text-field
            v-model="form.image_url"
            class="mb-2"
            label="Image URL"
            variant="underlined"
          />
          <v-text-field
            v-model="form.launch_cost"
            class="mb-2"
            label="Cost per launch (USD)"
            variant="underlined"
          />
          <v-text-field
            v-model="form.country_code"
            class="mb-2"
            label="Country code (e.g. USA)"
            variant="underlined"
          />
          <v-text-field
            v-model="form.maiden_flight"
            label="First flight (YYYY-MM-DD)"
            type="date"
            variant="underlined"
          />
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn
            variant="text"
            @click="open = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            rounded="0"
            type="submit"
            variant="flat"
          >
            Add rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useRocketsStore } from '@/stores/rockets'

  const store = useRocketsStore()
  const open = ref(false)
  const formRef = ref()

  const required = (value: string) => !!value?.trim() || 'Required'

  const emptyForm = () => ({
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    country_code: '',
    maiden_flight: '',
  })

  const form = reactive(emptyForm())

  async function submit () {
    const { valid } = await formRef.value.validate()
    if (!valid) return

    store.addRocket({
      name: form.full_name.trim(),
      full_name: form.full_name.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      launch_cost: form.launch_cost.trim() || null,
      maiden_flight: form.maiden_flight || null,
      manufacturer: form.country_code.trim()
        ? { name: 'SpaceX', country_code: form.country_code.trim() }
        : null,
    })

    Object.assign(form, emptyForm())
    formRef.value.resetValidation()
    open.value = false
  }
</script>

<style scoped>
.add-rocket-btn {
  width: 100%;
}

@media (min-width: 600px) {
  .add-rocket-btn {
    width: auto;
  }
}
</style>
