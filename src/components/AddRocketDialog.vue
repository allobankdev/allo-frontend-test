<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props" prepend-icon="mdi-plus">
        Add Rocket
      </v-btn>
    </template>

    <v-card title="Add New Rocket">
      <v-card-text>
        <v-form ref="form" v-model="isFormValid">
          <v-text-field
            v-model="formData.name"
            label="Rocket Name"
            :rules="[(v: string) => !!v || 'Name is required']"
            required
          />
          <v-textarea
            v-model="formData.description"
            label="Description"
            :rules="[(v: string) => !!v || 'Description is required']"
            required
          />
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="formData.cost_per_launch"
                label="Cost ($)"
                type="number"
                variant="outlined"
                :rules="[
                          (v: number) => !!v || 'Cost is required',
                          (v: number) => v > 0 || 'Cost must be greater than 0'
                        ]"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="formData.country"
                label="Country"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn
          color="primary"
          :disabled="!isFormValid"
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()
const dialog = ref(false)
const isFormValid = ref(false)

//formData is now typed based on your Rocket interface implicitly
const formData = reactive({
  name: '',
  description: '',
  cost_per_launch: 0,
  country: '',
  first_flight: new Date().toISOString().split('T')[0]
})

const save = () => {
  if (isFormValid.value) {
    store.addRocket({ ...formData })
    dialog.value = false

    // Reset form after saving
    formData.name = ''
    formData.description = ''
    formData.cost_per_launch = 0
    formData.country = ''
  }
}
</script>
