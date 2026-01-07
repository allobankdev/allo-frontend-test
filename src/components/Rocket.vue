<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <div class="text-center">
        <h1 class="font-weight-bold mb-15">Rocket List</h1>
      </div>

      <v-btn color="primary" class="mb-5" @click="showAddModal = true">
        Add Rocket
      </v-btn>

      <v-alert v-model="showAlert" type="success" dismissible class="mb-3">{{ alertMsg }}</v-alert>

      <div>
        <v-text-field
          v-model="search"
          density="compact"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          hide-details
          single-line
        ></v-text-field>

        <v-data-table
          :headers="headers"
          :loading="loading"
          v-model:search="search"
          :filter-keys="['name']"
          :items="tableRockets"
          hover
          @click:row="(_: any, row: { item: TableRocket; }) => handleDetail(row.item)"
        >
          <template v-slot:[`item.name`]="{ value }">
            <strong>{{ value }}</strong>
          </template>

          <template v-slot:[`item.image`]="{ value }">
            <v-card v-if="value" class="my-2" rounded>
              <v-img :src="value" height="64" cover />
            </v-card>
          </template>

          <template v-slot:[`item.description`]="{ value }">
            <span class="text-truncate d-inline-block" style="max-width: 300px">
              {{ value }}
            </span>
          </template>
        </v-data-table>
      </div>

      <div>
        <v-dialog v-model="showDetail" max-width="600">
          <v-card v-if="selectedItem != null">
            <v-card-title>
              {{ selectedItem.name }}
            </v-card-title>

            <v-card-text>
              <v-img
                v-if="selectedItem.image"
                :src="selectedItem.image"
                height="200"
                cover
                class="mb-4"
              />
              
              <div class="text-h6 font-weight-bold text-primary mb-1">
                Rp {{ Number(selectedItem.cost).toLocaleString("id-ID") }}
              </div>

              <div
                class="d-flex justify-space-between text-body-2 text-grey-darken-1 mb-3"
              >
                <div class="d-flex align-center">
                  <v-icon size="18" class="me-1">mdi-earth</v-icon>
                  {{ selectedItem.country }}
                </div>

                <div class="d-flex align-center">
                  <v-icon size="18" class="me-1">mdi-calendar</v-icon>
                  {{ selectedItem.first_flight }}
                </div>
              </div>

              <div class="text-body-1 text-grey-darken-3">
                {{ selectedItem.description }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="showDetail = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <div>
        <v-dialog v-model="showAddModal" max-width="600">
          <v-card>
            <v-card-title>Add Rocket</v-card-title>

            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="state.name"
                  label="Name"
                  :error-messages="v$.name.$errors.map((e) => e.$message)"
                  @blur="v$.name.$touch"
                />

                <v-text-field
                  v-model="state.image"
                  label="Image URL"
                  placeholder="https://example.com/rocket.jpg"
                  :error-messages="v$.image.$errors.map((e) => e.$message)"
                />

                <v-textarea
                  v-model="state.description"
                  label="Description"
                  :error-messages="
                    v$.description.$errors.map((e) => e.$message)
                  "
                  @blur="v$.description.$touch"
                />

                <v-text-field
                  v-model="state.first_flight"
                  label="First Flight"
                  type="date"
                  :error-messages="
                    v$.first_flight.$errors.map((e) => e.$message)
                  "
                />

                <v-select
                  v-model="state.country"
                  label="Country"
                  :items="countryOptions"
                  :error-messages="v$.country.$errors.map((e) => e.$message)"
                  @blur="v$.country.$touch"
                />

                <v-text-field
                  v-model.number="state.cost"
                  label="Cost per Launch"
                  type="number"
                  prefix="Rp"
                  :error-messages="v$.cost.$errors.map((e) => e.$message)"
                  @blur="v$.cost.$touch"
                />
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn variant="text" @click="clear">Clear</v-btn>
              <v-btn color="primary" @click="submit">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, url, numeric, minValue } from "@vuelidate/validators";

interface Rocket {
  id: string;
  name: string;
  flickr_images: string[];
  description: string;
  first_flight: string;
  cost_per_launch: number;
  country: string;
}

type TableRocket = {
  name: string;
  image: string;
  description: string;
  first_flight: string;
  cost: number | null;
  country: string;
};

const rockets = ref<Rocket[]>([]);
const loading = ref(false);
const localRockets = ref<unknown[]>([]);
const search = ref("");
const showDetail = ref(false);
const showAddModal = ref(false);
const selectedItem = ref<TableRocket | null>(null);
const showAlert = ref(false);
const alertMsg = ref("");

const countryOptions = ["United States", "Russia", "China", "Japan", "India"];

const initialState = {
  name: "",
  image: "",
  description: "",
  first_flight: "",
  country: "",
  cost: null as number | null,
};

const state = reactive({ ...initialState });
const rules = {
  name: { required },
  image: { required, url },
  description: { required },
  first_flight: { required },
  country: { required },
  cost: { required, numeric, minValue: minValue(1) },
};

const v$ = useVuelidate(rules, state);

function submit() {
  v$.value.$validate();
  if (v$.value.$invalid) return;

  localRockets.value.unshift({
    name: state.name,
    image: state.image,
    description: state.description,
    first_flight: state.first_flight,
    cost: state.cost,
    country: state.country,
  });

  alertMsg.value = "Successfully created Rocket";
  showAlert.value = true;

  clear();
  showAddModal.value = false;

  setTimeout(() => {
    showAlert.value = false
  }, 5000);
}

function clear() {
  v$.value.$reset();
  Object.assign(state, initialState);
}

const handleDetail = (item: TableRocket) => {
  selectedItem.value = item;
  showDetail.value = true;
};

async function fetchRockets() {
  loading.value = true;
  try {
    const res = await fetch("https://api.spacexdata.com/v4/rockets");
    rockets.value = await res.json();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

fetchRockets();

const headers = [
  { title: "Name", key: "name" },
  { title: "Image", key: "image" },
  { title: "Description", key: "description" },
];

const tableRockets = computed(() => [
  ...localRockets.value,
  ...rockets.value.map((r) => ({
    name: r.name,
    image: r.flickr_images?.[0] ?? "",
    description: r.description,
    cost: r.cost_per_launch,
    first_flight: r.first_flight,
    country: r.country,
  })),
]);
</script>
