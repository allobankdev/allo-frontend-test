<template>
    <v-container class="mt-10">
      <v-responsive class="align-centerfill-height mx-auto" max-width="900">
        <!-- Title -->
        <div class="text-center">
          <div class="text-body-2 font-weight-light mb-n1">Add</div>
          <h1 class="text-h2 font-weight-bold">Rocket</h1>
        </div>
  
        <!-- Back Button -->
        <div>
          <v-row>
            <v-col>
              <v-btn color="white" text @click="handleBack">
                <v-icon left>mdi-arrow-left</v-icon>
                Back
              </v-btn>
            </v-col>
          </v-row>
        </div>
  
        <!-- Form -->
        <div>
          <v-form ref="rocketForm" v-model:valid="valid" lazy-validation>
            <v-text-field
              v-model="newRocket.name"
              label="Name of The Rocket"
              placeholder="e.g. Crew-10"
              outlined
              class="form-control mt-5"
            />
  
            <v-text-field
              v-model="newRocket.description"
              label="Description"
              placeholder="This is the example description"
              outlined
              class="form-control mt-2"
            />
  
            <v-text-field
              v-model="newRocket.country"
              label="Country"
              placeholder="e.g. United States"
              outlined
              class="form-control mt-2"
            />
  
            <v-text-field
              v-model="newRocket.firstFlight"
              label="First Flight"
              placeholder="e.g. 2025-01-01 (YYYY-MM-DD)"
              outlined
              class="form-control mt-2"
            />
  
            <v-text-field
              v-model="newRocket.cost"
              label="Cost"
              placeholder="e.g. 1000"
              outlined
              class="form-control mt-2"
              type="number"
              min="0"
              step="0.100"
              @input="validateCost"
              @keypress="blockMinus"
            />
  
            <v-text-field
              v-model="newRocket.img"
              label="Link Image"
              placeholder="https://..."
              outlined
              class="form-control mt-2"
              @input="validateLink"
              :error-messages="imgErrorMessage"
            />
  
            <!-- Submit Button -->
            <div class="text-center">
              <v-btn
                @click="submitForm"
                color="primary"
                class="mt-3"
                :disabled="isFormInvalid"
                >Save</v-btn
              >
            </div>
          </v-form>
        </div>
      </v-responsive>
    </v-container>
  
    <!-- Success Alert -->
    <v-snackbar
      v-model="showAlert"
      color="success"
      location="top right"
      :timeout="3000"
    >
      Rocket successfully added!
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showAlert = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  
    <!-- Modal Loading -->
    <v-dialog v-model="loading" persistent max-width="400px">
      <v-card class="pa-4">
        <v-card-title class="headline text-center">Loading...</v-card-title>
        <v-card-subtitle class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
        </v-card-subtitle>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  const router = useRouter();
  
  interface Rocket {
    id: number;
    name: string;
    description: string;
    country: string;
    firstFlight: string;
    cost: number;
    img: string;
  }
  
  const rockets = ref<Rocket[]>([]);
  
  const newRocket = ref<Rocket>({
    id: 0,
    name: "",
    description: "",
    country: "",
    firstFlight: "",
    cost: 0,
    img: "",
  });
  
  const valid = ref(false);
  const imgErrorMessage = ref<string>("");
  const loading = ref(false);
  const showAlert = ref(false);
  
  onMounted(() => {
    const storedRockets = localStorage.getItem("rockets-data");
    if (storedRockets) {
      rockets.value = JSON.parse(storedRockets);
    }
  });
  
  const handleBack = () => {
    router.push({ name: "Home" });
  };
  
  const submitForm = () => {
    loading.value = true;
  
    setTimeout(() => {
      const highestId =
        rockets.value.length > 0
          ? Math.max(...rockets.value.map((rocket) => rocket.id))
          : 0;
  
      newRocket.value.id = highestId + 1;
  
      rockets.value.push({ ...newRocket.value });
      localStorage.setItem("rockets-data", JSON.stringify(rockets.value));
  
      newRocket.value = {
        id: 0,
        name: "",
        description: "",
        country: "",
        firstFlight: "",
        cost: 0,
        img: "",
      };
  
      loading.value = false;
      showAlert.value = true;
  
      setTimeout(() => {
        router.push({ name: "Home" });
      }, 1000);
    }, 500);
  };
  
  const validateCost = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    if (parseFloat(value) < 0) {
      (e.target as HTMLInputElement).value = "0";
      newRocket.value.cost = 0;
    }
  };
  
  const validateLink = () => {
    if (newRocket.value.img && !newRocket.value.img.startsWith("https://")) {
      imgErrorMessage.value = "The image link must start with 'https://'";
    } else {
      imgErrorMessage.value = "";
    }
  };
  
  const blockMinus = (e: KeyboardEvent): void => {
    if (e.key === "-") {
      e.preventDefault();
    }
  };
  
  const isFormInvalid = computed(() => {
    return (
      !newRocket.value.name ||
      !newRocket.value.description ||
      !newRocket.value.country ||
      newRocket.value.cost <= 0 ||
      (newRocket.value.img && !newRocket.value.img.startsWith("https://")) ||
      !newRocket.value.img
    );
  });
  </script>
  