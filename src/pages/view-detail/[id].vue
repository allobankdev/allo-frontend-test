<template>
  <v-container class="mt-10">
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <!-- Title -->
      <div class="text-center">
        <div class="text-body-2 font-weight-light mb-n1">Detail of</div>
        <h1 class="text-h2 font-weight-bold">
          <!-- Show rocket name if available, else show "No Rocket Found" -->
          <span v-if="rocket">{{ rocket?.name }}</span>
          <span v-else>Undefined Number</span>
        </h1>
      </div>

      <!-- Back Button -->
      <div v-if="rocket">
        <v-row>
          <v-col>
            <v-btn color="white" text @click="handleBack">
              <v-icon left>mdi-arrow-left</v-icon>
              Back
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Image -->
      <div v-if="rocket" class="my-6 text-center">
        <img
          :src="rocket?.links?.patch?.small"
          alt="Rocket Image"
          class="rocket-image"
        />
      </div>

      <!-- Description -->
      <div v-if="rocket" class="mb-5">
        <h4 class="text-h4 font-weight-bold mb-4">Description</h4>
        <p>{{ rocket?.description || "No Description" }}</p>
      </div>

      <!-- Cost Per Launch -->
      <div v-if="rocket" class="mb-5">
        <h4 class="text-h4 font-weight-bold mb-4">Cost Per Launch</h4>
        <p>{{ rocket?.cost ? "$" + rocket.cost : "No Cost Information" }}</p>
      </div>

      <!-- Country -->
      <div v-if="rocket" class="mb-5">
        <h4 class="text-h4 font-weight-bold mb-4">Country</h4>
        <p>{{ rocket?.country || "No Country Information" }}</p>
      </div>

      <!-- First Flight -->
      <div v-if="rocket" class="mb-5">
        <h4 class="text-h4 font-weight-bold mb-4">First Flight</h4>
        <p>{{ rocket?.firstFlight || "No Flight Information" }}</p>
      </div>

      <!-- Else : If ID not found -->
      <div v-else class="text-center mt-5">
        <h3>No rockets found</h3>
      </div>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const handleBack = () => {
  router.push({ name: "Home" });
  localStorage.removeItem("selectedRocket");
};

interface Rocket {
  id: string | number;
  name: string;
  description?: string;
  links: {
    patch: {
      small: string;
    };
  };
  cost?: string;
  country?: string;
  firstFlight?: string;
}

const rocket = ref<Rocket | null>(null);

onMounted(() => {
  const storedRocket = localStorage.getItem("selectedRocket");
  if (storedRocket) {
    rocket.value = JSON.parse(storedRocket);
  }
});
</script>

<style scoped>
.rocket-image {
  width: 30%; 
  height: auto; 
}
</style>
