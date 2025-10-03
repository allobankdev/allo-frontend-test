<script setup lang="ts">
import { ref } from "vue";
import { useRocketStore } from "@/stores/Rockets";
import type { Rocket } from "@/stores/Rockets/model";

const rocketStore = useRocketStore();
const emit = defineEmits(["close"]);

const form = ref<Rocket>({
  id: Date.now().toString(), 
  rocket_name: "",
  description: "",
  cost_per_launch: 0,
  country: "",
  company: "",
  first_flight: "",
  flickr_images: [],
});

// Simpan ke localStorage & update store
function saveRocket() {
  try {
    const stored = JSON.parse(localStorage.getItem("rockets") || "[]");
    stored.push(form.value);
    localStorage.setItem("rockets", JSON.stringify(stored));
    rocketStore.$patch({
      rocketData: [...rocketStore.rocketData, form.value],
    });

    // reset form
    form.value = {
      id: Date.now().toString(),
      rocket_name: "",
      description: "",
      cost_per_launch: 0,
    //   country: "",
      company: "",
      first_flight: "",
      flickr_images: [],
    };

    alert("Rocket berhasil ditambahkan 🚀");
    emit("close");
  } catch (err) {
    console.error("Gagal simpan rocket:", err);
  }
}
</script>

<template>
  <v-card
    class="pa-6"
    elevation="4"
  >
    <div class="d-flex justify-space-between align-center mb-4">
      <h3 class="text-h6 font-weight-bold">
        Add Rocket Baru
      </h3>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        @click="emit('close')"
      />
    </div>

    <v-form @submit.prevent="saveRocket">
      <!-- Rocket Name -->
      <v-text-field
        v-model="form.rocket_name"
        label="Rocket Name"
        variant="outlined"
        required
        class="mb-3"
      />

      <!-- Rocket Description -->
      <v-textarea
        v-model="form.description"
        label="Description"
        variant="outlined"
        required
        class="mb-3"
      />

      <!-- Cost per Launch -->
      <v-text-field
        v-model="form.cost_per_launch"
        type="number"
        label="Cost per Launch ($)"
        variant="outlined"
        required
        class="mb-3"
      />

      <!-- Country -->
      <v-text-field
        v-model="form.country"
        label="Country"
        variant="outlined"
        required
        class="mb-3"
      />

      <!-- Company -->
      <v-text-field
        v-model="form.company"
        label="Company"
        variant="outlined"
        required
        class="mb-3"
      />

      <!-- First Flight -->
      <v-text-field
        v-model="form.first_flight"
        label="First Flight (YYYY-MM-DD)"
        variant="outlined"
        required
        class="mb-3"
      />

      <!-- Rocket Image -->
      <v-text-field
        v-model="form.flickr_images[0]"
        label="Rocket Image URL"
        variant="outlined"
        required
        class="mb-3"
      />

      <!-- Submit -->
      <v-btn
        type="submit"
        color="primary"
        block
      >
        Tambah Rocket
      </v-btn>
    </v-form>
  </v-card>
</template>
