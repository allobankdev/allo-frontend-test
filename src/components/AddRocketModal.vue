<template>
  <v-dialog v-model="internalModel" max-width="600" persistent>
    <v-card class="glass-card rounded-xl pa-4">
      <v-card-title class="d-flex justify-space-between align-center px-4 pt-4">
        <h2 class="text-h5 font-weight-bold">Add New Rocket</h2>
        <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form ref="form" v-model="isFormValid">
          <v-text-field
            v-model="formData.name"
            label="Rocket Name"
            placeholder="e.g. Starship"
            required
            :rules="[v => !!v || 'Name is required']"
            variant="outlined"
            class="mb-4"
          ></v-text-field>

          <v-textarea
            v-model="formData.description"
            label="Description"
            placeholder="Describe the rocket..."
            required
            :rules="[v => !!v || 'Description is required']"
            variant="outlined"
            class="mb-4"
          ></v-textarea>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="formData.cost_per_launch"
                label="Cost per Launch ($)"
                type="number"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.country"
                label="Country"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            v-model="formData.imageUrl"
            label="Image URL"
            placeholder="https://..."
            variant="outlined"
            class="mb-4"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          class="px-6 rounded-pill"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          class="px-8 rounded-pill font-weight-bold"
          :disabled="!isFormValid"
          @click="submit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRocketStore } from '@/stores/rocketStore';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const rocketStore = useRocketStore();
const internalModel = ref(props.modelValue);
const isFormValid = ref(false);

const initialData = {
  name: '',
  description: '',
  cost_per_launch: 0,
  country: '',
  first_flight: new Date().toISOString().split('T')[0],
  imageUrl: 'https://images2.imgbox.com/3c/0e/T8tx9K1S_o.png', // Default SpaceX image
  flickr_images: [] as string[],
  height: { meters: 0, feet: 0 },
  diameter: { meters: 0, feet: 0 },
  mass: { kg: 0, lb: 0 }
};

const formData = ref({ ...initialData });

watch(() => props.modelValue, (val) => {
  internalModel.value = val;
});

const close = () => {
  emit('update:modelValue', false);
  formData.value = { ...initialData };
};

const submit = () => {
  if (isFormValid.value) {
    const rocketToExtra = {
      ...formData.value,
      flickr_images: [formData.value.imageUrl || initialData.imageUrl]
    };
    // @ts-ignore
    delete rocketToExtra.imageUrl;
    
    rocketStore.addRocket(rocketToExtra as any);
    close();
  }
};
</script>

<style scoped>
.glass-card {
  background: rgba(18, 18, 18, 0.9) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}
</style>
