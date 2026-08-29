<template>
  <v-container>
    <v-row>
      <v-col style="padding: 0">
        <v-checkbox label="Simulate Error" v-model="errorSimulation"></v-checkbox>
      </v-col>
      <v-col align="end" v-if="!errorLoad && !loading">
        <v-btn class="bg-blue mb-4" rounded value="true" @click="addRocket">
          <v-icon icon="mdi-plus"></v-icon> &nbsp; Add
        </v-btn>
      </v-col>
    </v-row>

    <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-rocket"></v-icon> &nbsp; List Rocket

        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          density="compact"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
        ></v-text-field>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table
        v-if="!errorLoad"
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="datas"
        :loading="loading"
        :search="search"
        item-value="name"
      >
        <template #item.image="{ item }">
          <v-card :to="`/rocket/detail/${item.id}`" class="my-2" elevation="2" rounded>
            <v-img :src="item.flickr_images[0]" min-width="150" cover />
          </v-card>
        </template>

        <template #item.cost_per_launch="{ item }">
          {{
            item.cost_per_launch.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })
          }}
        </template>

        <template #item.success_rate_pct="{ item }">
          {{ item.success_rate_pct }}%
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-center">
            <v-btn
              border
              class="me-2 bg-blue"
              prepend-icon="mdi-eye"
              rounded="lg"
              text="View"
              :to="`/rocket/form/${item.id}`"
            />
          </div>
        </template>
      </v-data-table>

      <v-col v-else style="margin: 50px; text-align: center">
        <p>Failed to fetch rocket. Would you like to Retry ?</p>
        <v-col align="center">
          <v-btn class="bg-blue mb-4" rounded @click="loadItems">
            <v-icon icon="mdi-refresh"></v-icon> &nbsp; Retry
          </v-btn>
        </v-col>
      </v-col>
    </v-card>
  </v-container>

  <v-dialog v-model="dialog" max-width="50%">
    <v-card>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-plus"></v-icon> &nbsp; Add Rocket
      </v-card-title>
      <form ref="form" class="pa-4">
        <v-text-field
          v-model="state.name"
          :counter="50"
          :error-messages="v$.name.$errors.map((e) => e.$message)"
          label="Rocket Name"
          required
          @blur="v$.name.$touch"
          @input="v$.name.$touch"
        >
        </v-text-field>
        <v-textarea
          v-model="state.description"
          :error-messages="v$.description.$errors.map((e) => e.$message)"
          label="Description"
          required
          @blur="v$.description.$touch"
          @input="v$.description.$touch"
        >
        </v-textarea>
        <v-select
          v-model="state.country"
          :error-messages="v$.country.$errors.map((e) => e.$message)"
          label="Country"
          required
          @blur="v$.country.$touch"
          @input="v$.country.$touch"
          :items="countryList"
        >
        </v-select>
        <v-text-field
          v-model="state.first_flight"
          :error-messages="v$.first_flight.$errors.map((e) => e.$message)"
          label="First Flight"
          required
          @blur="v$.first_flight.$touch"
          @input="v$.first_flight.$touch"
        >
        </v-text-field>
        <v-text-field
          v-model="state.cost_per_launch"
          :error-messages="v$.cost_per_launch.$errors.map((e) => e.$message)"
          label="Cost Per Launch"
          required
          @blur="v$.cost_per_launch.$touch"
          @input="v$.cost_per_launch.$touch"
        >
        </v-text-field>

        <h3 class="mb-2">Images</h3>
        <v-text-field
          v-model="state.flickr_images[0]"
          label="Image 1"
          hint="Enter image URL"
        ></v-text-field>
        <v-text-field
          v-model="state.flickr_images[1]"
          label="Image 2"
          hint="Enter image URL"
        ></v-text-field>
        <v-text-field
          v-model="state.flickr_images[2]"
          label="Image 3"
          hint="Enter image URL"
        ></v-text-field>
        <v-text-field
          v-model="state.flickr_images[3]"
          label="Image 4"
          hint="Enter image URL"
        ></v-text-field>
        <v-text-field
          v-model="state.flickr_images[4]"
          label="Image 5"
          hint="Enter image URL"
        ></v-text-field>
      </form>
      <v-divider />

      <v-card-actions class="bg-surface-light">
        <v-btn text="Clear" class="bg-warning" @click="resetForm" />
        <v-btn text="Cancel" class="bg-error" @click="dialog = false" />
        <v-btn class="bg-primary" text="Save" @click="submitForm" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import { rocketStore } from "@/stores/rockets.js";
import { useVuelidate } from "@vuelidate/core";
import { decimal, required } from "@vuelidate/validators";

const datas = ref([]);
const loading = ref(true);
const itemsPerPage = ref(3);
const search = ref("");
const dialog = ref(false);
const errorLoad = ref(false);

const errorSimulation = ref(false);

const initialState = {
  id: "",
  name: "",
  description: "",
  country: "",
  first_flight: "",
  cost_per_launch: 0,
  flickr_images: [],
};

const state = reactive({
  ...initialState,
});

const rules = {
  name: { required },
  description: { required },
  country: { required },
  first_flight: { required },
  cost_per_launch: { required, decimal },
};

const countryList = ["United States", "Russia", "China", "India", "European Union"];

onMounted(() => {
  loadItems();
});

watch(search, () => {
  console.log("Test");
  setDatas();
});

watch(errorSimulation, () => {
  loadItems();
});

const v$ = useVuelidate(rules, state);

const headers = ref([
  { title: "Image", key: "image", sortable: false },
  { title: "Rocket Name", key: "name", sortable: false },
  { title: "Description", key: "description", sortable: false },
  { title: "Cost Per Launch", key: "cost_per_launch", sortable: false },
  { title: "Country", key: "country", sortable: false },
  { title: "First Flight", key: "first_flight", sortable: false },
]);

async function loadItems() {
  errorLoad.value = false;
  loading.value = true;

  if (errorSimulation.value) {
    rocketStore().removeAll();
    setDatas();
    setTimeout(() => {
      errorLoad.value = true;
      loading.value = false;
      return;
    }, 1000);
  } else {
    setTimeout(() => {
      if (rocketStore().listRockets.length === 0) {
        console.log("Fetching rockets from store...");
        rocketStore()
          .fetchRockets()
          .then(() => {
            setDatas();
            console.log("Fetched datas", datas);
            loading.value = false;
          })
          .catch((error) => {
            console.log("Fetched datas error", error);
            errorLoad.value = true;
            loading.value = false;
          });
      } else {
        setDatas();
        loading.value = false;
      }
    }, 1000);
  }
}

function setDatas() {
  const list = rocketStore().listRockets;
  datas.value = search.value
    ? list.filter(
        (item) =>
          item.name.toLowerCase().includes(search.value.toLowerCase()) ||
          item.description.toLowerCase().includes(search.value.toLowerCase())
      )
    : list;
}

function addRocket() {
  dialog.value = true;
  resetForm();
}

function resetForm() {
  v$.value.$reset();

  for (const [key, value] of Object.entries(initialState)) {
    state[key] = value;
  }
}

function submitForm() {
  state.flickr_images = state.flickr_images.filter((url) => url !== "");

  console.log("state : ", state);
  if (state.flickr_images.length < 1) {
    alert("Must have at least 1 image");
    return;
  }

  v$.value.$validate();
  if (v$.value.$invalid) {
    return;
  }
  state.id = Date.now().toString();

  rocketStore().addRocket(state);
  loadItems();
  dialog.value = false;
}
</script>
