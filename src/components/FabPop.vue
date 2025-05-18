<!--
This is the add data rocket part, although to take a note the Space-X API didn't allowed to make a new data into their API but indeed there are the API documentation,
so instead I created a "Add Rocket" using pinia as the state management and store the new data in there.
*note: the data that is submitted is will be gone if the page is refreshed due to state management behavior
-->
<template>
  <v-btn
    icon="mdi-plus"
    color="cyan-accent-2"
    size="large"
    class="fab-button"
    @click="dialog = true"
  />
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title>Add New Rocket</v-card-title>
      <v-card-text>
        <v-form v-model="formValid">
          <v-text-field v-model="form.name" label="Name" required />
          <v-text-field v-model="form.type" label="Type" readonly/>
          <v-checkbox v-model="form.active" label="Active" />
          <v-text-field v-model="form.stages" label="Stages" type="number" />
          <v-text-field v-model="form.boosters" label="Boosters" type="number" />
          <v-text-field v-model="form.cost_per_launch" label="Cost Per Launch ($)" type="number" />
          <v-text-field v-model="form.success_rate_pct" label="Success Rate (%)" type="number" />
          <v-text-field v-model="form.first_flight" label="First Flight (YYYY-MM-DD)" type="date" />
          <v-text-field v-model="form.country" label="Country" />
          <v-text-field v-model="form.company" label="Company" />

          <v-divider class="my-4" />
          <h4 class="text-h6">Height</h4>
          <v-text-field v-model="form.height.meters" label="Meters" type="number" />
          <v-text-field v-model="form.height.feet" label="Feet" type="number" />

          <h4 class="text-h6">Diameter</h4>
          <v-text-field v-model="form.diameter.meters" label="Meters" type="number" />
          <v-text-field v-model="form.diameter.feet" label="Feet" type="number" />

          <h4 class="text-h6">Mass</h4>
          <v-text-field v-model="form.mass.kg" label="Kilograms" type="number" />
          <v-text-field v-model="form.mass.lb" label="Pounds" type="number" />

          <v-divider class="my-4" />
          <v-textarea v-model="form.description" label="Description" rows="3" />

          <small class="text-grey">* This doesn't actually save.</small>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Close</v-btn>
        <v-btn variant="elevated" :disabled="!formValid" @click="submitForm">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup lang="ts">
import { ref } from "vue";
import {useRocketStore} from "@/store/RocketStore";

const rocketStore = useRocketStore();

const dialog = ref(false);

const formValid = ref(false);

const form = ref({
  name: '',
  type: 'Rocket',
  active: false,
  stages: 0,
  boosters: 0,
  cost_per_launch: 0,
  success_rate_pct: 0,
  first_flight: '',
  country: '',
  company: '',
  height: { meters: 0, feet: 0 },
  diameter: { meters: 0, feet: 0 },
  mass: { kg: 0, lb: 0 },
  description: '',
  // The rest is as default value
  flickr_images: [
    "https://live.staticflickr.com/65535/48954138962_ee541e6755_b.jpg",
    "https://live.staticflickr.com/65535/48953946911_e60c5bcc5c_b.jpg",
    "https://live.staticflickr.com/65535/48954138922_9c42173f08_b.jpg",
    "https://live.staticflickr.com/65535/48953947006_313f01ec93_b.jpg"
  ],
  payload_weights: [],
  first_stage: {
    reusable: false,
    engines: 0,
    fuel_amount_tons: 0,
    burn_time_sec: 0,
    thrust_sea_level: {
      kN: 0,
      lbf: 0
    },
    thrust_vacuum: {
      kN: 0,
      lbf: 0
    }
  },
  second_stage: {
    reusable: false,
    engines: 0,
    fuel_amount_tons: 0,
    burn_time_sec: 0,
    thrust: {
      kN: 0,
      lbf: 0
    },
    payloads: {
      option_1: '',
      composite_fairing: {
        height: {
          meters: 0,
          feet: 0
        },
        diameter: {
          meters: 0,
          feet: 0
        }
      }
    }
  },
  engines: {
    number: 0,
    type: '',
    version: '',
    layout: '',
    isp: {
      sea_level: 0,
      vacuum: 0
    },
    engine_loss_max: 0,
    propellant_1: '',
    propellant_2: '',
    thrust_sea_level: {
      kN: 0,
      lbf: 0
    },
    thrust_vacuum: {
      kN: 0,
      lbf: 0
    },
    thrust_to_weight: 0
  },
  landing_legs: {
    number: 0,
    material: null // Use a proper object or string type if known
  },
  wikipedia: ''
});

const submitForm = () => {
  rocketStore.addRocket(form.value);
  dialog.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    name: '',
    type: 'Rocket',
    active: false,
    stages: 0,
    boosters: 0,
    cost_per_launch: 0,
    success_rate_pct: 0,
    first_flight: '',
    country: '',
    company: '',
    height: { meters: 0, feet: 0 },
    diameter: { meters: 0, feet: 0 },
    mass: { kg: 0, lb: 0 },
    description: '',
    flickr_images: [
      "https://live.staticflickr.com/65535/48954138962_ee541e6755_b.jpg",
      "https://live.staticflickr.com/65535/48953946911_e60c5bcc5c_b.jpg",
      "https://live.staticflickr.com/65535/48954138922_9c42173f08_b.jpg",
      "https://live.staticflickr.com/65535/48953947006_313f01ec93_b.jpg"
    ],
    payload_weights: [],
    first_stage: {
      reusable: false,
      engines: 0,
      fuel_amount_tons: 0,
      burn_time_sec: 0,
      thrust_sea_level: {
        kN: 0,
        lbf: 0
      },
      thrust_vacuum: {
        kN: 0,
        lbf: 0
      }
    },
    second_stage: {
      reusable: false,
      engines: 0,
      fuel_amount_tons: 0,
      burn_time_sec: 0,
      thrust: {
        kN: 0,
        lbf: 0
      },
      payloads: {
        option_1: '',
        composite_fairing: {
          height: {
            meters: 0,
            feet: 0
          },
          diameter: {
            meters: 0,
            feet: 0
          }
        }
      }
    },
    engines: {
      number: 0,
      type: '',
      version: '',
      layout: '',
      isp: {
        sea_level: 0,
        vacuum: 0
      },
      engine_loss_max: 0,
      propellant_1: '',
      propellant_2: '',
      thrust_sea_level: {
        kN: 0,
        lbf: 0
      },
      thrust_vacuum: {
        kN: 0,
        lbf: 0
      },
      thrust_to_weight: 0
    },
    landing_legs: {
      number: 0,
      material: null
    },
    wikipedia: ''
  };
  formValid.value = false;
};

</script>

<style scoped>
.fab-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
}
</style>
