<template>
  <v-dialog v-model="dialogVisible" max-width="600px">
    <template v-slot:activator="{ props }">
      <v-btn
        color="primary"
        v-bind="props"
        prepend-icon="mdi-plus"
      >
        Add New Rocket
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="text-h5">Add New Rocket</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="isFormValid" @submit.prevent="submit">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newRocket.name"
                  label="Rocket Name*"
                  required
                  :rules="[v => !!v || 'Name is required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="newRocket.description"
                  label="Description*"
                  required
                  :rules="[v => !!v || 'Description is required']"
                  rows="3"
                ></v-textarea>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="newRocket.cost_per_launch"
                  label="Cost Per Launch (USD)*"
                  type="number"
                  required
                  :rules="[
                    v => !!v || 'Cost is required',
                    v => v > 0 || 'Cost must be greater than 0'
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRocket.country"
                  label="Country*"
                  required
                  :rules="[v => !!v || 'Country is required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRocket.first_flight"
                  label="First Flight Date*"
                  type="date"
                  required
                  :rules="[v => !!v || 'First flight date is required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="newRocket.image_url"
                  label="Image URL*"
                  required
                  :rules="[
                    v => !!v || 'Image URL is required',
                    v => /^https?:\/\/.+/.test(v) || 'Must be a valid URL'
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialogVisible = false">
          Cancel
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="submit"
          :disabled="!isFormValid"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRocketsStore } from '@/stores/rockets';
import type { NewRocket } from '@/types/rocket';
import { ref, reactive } from 'vue';
const rocketStore = useRocketsStore();
const dialogVisible = ref(false);
const isFormValid = ref(false);
const form = ref<any>(null);
const newRocket = reactive<NewRocket>({
  name: '',
  description: '',
  cost_per_launch: 0,
  country: '',
  first_flight: '',
  image_url: ''
});
const submit = () => {
  if (!isFormValid.value) {
    return;
  }
  
  rocketStore.addRocket({ ...newRocket });
  
  resetForm();
  dialogVisible.value = false;
};
const resetForm = () => {
  newRocket.name = '';
  newRocket.description = '';
  newRocket.cost_per_launch = 0;
  newRocket.country = '';
  newRocket.first_flight = '';
  newRocket.image_url = '';
  
  if (form.value) {
    form.value.resetValidation();
  }
};
</script>