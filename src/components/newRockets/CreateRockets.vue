<template>
  <div class="container mt-5">
    <div
      v-if="alert.show"
      class="alert"
      :class="`alert-${alert.type}`"
      role="alert"
    >
      {{ alert.message }}
    </div>

    <div class="row mb-5">
      <div class="col">
        <button class="btn btn-success" @click="goBack">Kembali</button>
      </div>
    </div>
    <div class="mb-3">
      <label for="nameRocket" class="form-label">Name Rocket</label>
      <input
        type="text"
        class="form-control"
        id="nameRocket"
        placeholder="Input Rocket Name"
        v-model="form.name"
        :class="{ 'is-invalid': errors.name }"
      />
      <div class="invalid-feedback">{{ errors.name }}</div>
    </div>
    <div class="mb-3">
      <label for="country" class="form-label">Country</label>
      <input
        type="text"
        class="form-control"
        id="country"
        placeholder="Input Country"
        v-model="form.country"
        :class="{ 'is-invalid': errors.country }"
      />
      <div class="invalid-feedback">{{ errors.country }}</div>
    </div>
    <div class="mb-3">
      <label for="imageRocket" class="form-label">Image Rocket</label>
      <input
        type="file"
        class="form-control"
        id="imageRocket"
        @change="handleImage"
      />
    </div>
    <div class="mb-3">
      <label for="descriptionRocket" class="form-label"
        >Rocket Description</label
      >
      <textarea
        class="form-control"
        id="descriptionRocket"
        rows="3"
        placeholder="Description"
        v-model="form.description"
        :class="{ 'is-invalid': errors.description }"
      ></textarea>
      <div class="invalid-feedback">{{ errors.description }}</div>
    </div>
    <div class="row">
      <div class="col-md-4" style="width: 200px">
        <label for="firstFlight" class="form-label">First Flight</label>
        <div class="input-group mb-3">
          <input
            type="date"
            class="form-control"
            id="firstFlight"
            placeholder="2025-01-01"
            v-model="form.first_flight"
            :class="{ 'is-invalid': errors.first_flight }"
          />
          <div class="invalid-feedback">{{ errors.first_flight }}</div>
        </div>
      </div>
      <div class="col-md-4" style="width: 200px">
        <label for="kosong" class="form-label">Status Rocket</label>
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{
              selectRocket === null
                ? "Select Status"
                : selectRocket === true
                ? "Active"
                : "Non-Active"
            }}
          </button>
          <ul class="dropdown-menu">
            <li v-for="item in activeRocket" :key="item">
              <a
                class="dropdown-item"
                href="#"
                @click="storeRocket.selectRocketActive(item)"
                >{{ item === true ? "Active" : "Non-Active" }}</a
              >
            </li>
          </ul>
        </div>
        <div class="text-danger mt-1" v-if="errors.active">
          {{ errors.active }}
        </div>
      </div>
      <div class="col-md-4">
        <div class="mb-3">
          <label for="cost" class="form-label">Cost Per Launch</label>
          <input
            type="number"
            class="form-control"
            id="cost"
            placeholder="150000"
            v-model="form.cost_per_launch"
            :class="{ 'is-invalid': errors.cost_per_launch }"
          />
          <div class="invalid-feedback">{{ errors.cost_per_launch }}</div>
        </div>
      </div>
    </div>
    <button
      class="btn btn-success"
      @click="handleSubmit"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? "Sending..." : "Send" }}
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

import { rocketStore } from "@/stores/rocket.js";
import { storeToRefs } from "pinia";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { onMounted, reactive, ref } from "vue";
//

const isSubmitting = ref(false);

const form = reactive({
  name: "",
  country: "",
  description: "",
  first_flight: "",
  cost_per_launch: null,
  image: null,
});
const alert = reactive({
  show: false,
  type: "success", // success | danger
  message: "",
});

// ===== ERROR STATE =====
const errors = reactive({});

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.name) errors.name = "Rocket name is required";
  if (!form.country) errors.country = "Country is required";
  if (!form.description) errors.description = "Description is required";
  if (!form.first_flight) errors.first_flight = "First flight date is required";
  if (selectRocket.value === null) errors.active = "Rocket status is required";
  if (!form.cost_per_launch || form.cost_per_launch <= 0)
    errors.cost_per_launch = "Cost must be greater than 0";

  return Object.keys(errors).length === 0;
};
const showAlert = (type, message) => {
  alert.type = type;
  alert.message = message;
  alert.show = true;

  setTimeout(() => {
    alert.show = false;
  }, 3000);
};

const handleSubmit = async () => {
  if (!validateForm()) {
    showAlert("danger", "Form Anda belum lengkap!");
    return;
  }
  isSubmitting.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const success = storeRocket.addRocket({
      ...form,
      active: selectRocket.value,
    });

    if (success) {
      showAlert("success", "Rocket berhasil ditambahkan!");

      router.push("/");
    } else {
      showAlert("danger", "Gagal menambahkan rocket.");
    }
  } catch (error) {
    showAlert("danger", "Terjadi kesalahan");
  } finally {
    isSubmitting.value = false;
  }
};

const handleImage = (e) => {
  form.image = e.target.files[0];
};
const storeRocket = rocketStore();

const { activeRocket, selectRocket } = storeToRefs(storeRocket);
onMounted(() => {
  storeRocket.getDataRockets();
  storeRocket.defaultYearValue();
});
const router = useRouter();

const goBack = () => {
  router.push("/");
};
</script>
