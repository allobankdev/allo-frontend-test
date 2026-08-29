<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Add New Rocket</span>
      <v-btn
        icon
        @click="$emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-form
      v-model="isValid"
      @submit.prevent="addRocket"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.name"
              label="Rocket Name"
              :rules="[v => !!v || 'Name is required']"
              required
              prepend-icon="mdi-rocket"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="Description"
              :rules="[v => !!v || 'Description is required']"
              required
              rows="3"
              prepend-icon="mdi-text"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="form.country"
              label="Country"
              :rules="[v => !!v || 'Country is required']"
              required
              prepend-icon="mdi-earth"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model.number="form.cost_per_launch"
              label="Cost per Launch (in millions)"
              type="number"
              :rules="[
                v => !!v || 'Cost is required',
                v => v > 0 || 'Cost must be greater than 0'
              ]"
              required
              prepend-icon="mdi-cash"
              suffix="M"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.flickr_images"
              label="Image URLs (one per line)"
              placeholder="https://example.com/image1.jpg"
              rows="3"
              prepend-icon="mdi-image"
            />
            <div class="text-caption text-grey mt-1">
              Enter image URLs, one per line. Leave empty for default image.
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn 
          color="grey" 
          variant="text" 
          @click="$emit('close')"
        >
          Cancel
        </v-btn>
        <v-btn 
          color="primary" 
          type="submit"
          :disabled="!isValid"
          :loading="isSubmitting"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRocketStore } from '@/stores/rocketStore';
import type { NewRocketData } from '@/types/rocket';

const emit = defineEmits<{
  close: [];
}>();

const store = useRocketStore();
const isValid = ref(false);
const isSubmitting = ref(false);

const form = ref<NewRocketData & { cost_per_launch: number }>({
  name: '',
  description: '',
  country: '',
  cost_per_launch: 0,
  flickr_images: []
});

const addRocket = () => {
  if (!isValid.value) return;
  
  isSubmitting.value = true;
  
  // Process image URLs
  const imageUrls = form.value.flickr_images
    ? form.value.flickr_images
        .toString()
        .split('\n')
        .map(url => url.trim())
        .filter(url => url)
    : [];
  
  const rocketData: NewRocketData = {
    ...form.value,
    cost_per_launch: form.value.cost_per_launch * 1000000,
    flickr_images: imageUrls
  };
  
  store.addRocket(rocketData);
  
  // Reset form
  form.value = {
    name: '',
    description: '',
    country: '',
    cost_per_launch: 0,
    flickr_images: []
  };
  
  isSubmitting.value = false;
  emit('close');
};
</script>