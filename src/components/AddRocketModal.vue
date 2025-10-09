<script setup lang="ts">
import { useRocketStore } from "@/stores/rocketStore";
import { ref } from "vue";

const emit = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();

const rocketStore = useRocketStore();
const { addRocket, saveToLocalStorage } = rocketStore;

const form = ref({
  name: "",
  country: "",
  cost_per_launch: 0,
  description: "",
  flickr_images: [""],
});

const handleAddRocket = () => {
  if (!form.value.name || !form.value.description) return;

  addRocket({ ...form.value });
  saveToLocalStorage();

  emit("success");
  emit("close");

  resetForm();
};

const resetForm = () => {
  form.value = {
    name: "",
    country: "",
    cost_per_launch: 0,
    description: "",
    flickr_images: [""],
  };
};
</script>

<template>
  <v-dialog persistent max-width="500px">
    <v-card>
      <v-card-title class="text-h6">Add New Rocket</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleAddRocket">
          <v-text-field v-model="form.name" label="Rocket Name" required />
          <v-text-field v-model="form.country" label="Country" required />
          <v-text-field
            v-model.number="form.cost_per_launch"
            label="Cost per Launch"
            type="number"
            required
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
            required
          />
          <v-text-field v-model="form.flickr_images[0]" label="Image URL" />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="emit('close')">Cancel</v-btn>
        <v-btn color="primary" @click="handleAddRocket">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
