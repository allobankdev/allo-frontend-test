<template>
  <v-container>
    <v-row align="center" class="mb-4">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold">SpaceX Rockets</h1>
      </v-col>
      <v-col cols="12" md="4" class="text-md-right">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <v-text-field
      v-model="filter"
      label="Search Rockets"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      class="mb-6"
    ></v-text-field>

    <v-row v-if="store.loading" justify="center" class="my-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </v-row>

    <v-alert
      v-else-if="store.error"
      type="error"
      title="Error"
      :text="store.error"
      class="mb-6"
    >
      <template v-slot:append>
        <v-btn variant="outlined" @click="store.loadData">Retry</v-btn>
      </template>
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>Add New Rocket</v-card-title>
        <v-card-text>
          <v-form ref="rocketForm" @submit.prevent="submitRocket">
            <v-text-field
              v-model="form.name"
              label="Rocket Name *"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-textarea
              v-model="form.description"
              label="Description *"
              :rules="[rules.required, rules.minLength]"
              rows="3"
              required
            ></v-textarea>

            <v-text-field
              v-model="form.country"
              label="Country *"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-text-field
              v-model.number="form.cost"
              label="Cost per Launch ($)"
              type="number"
              hint="Optional (Default: 0)"
              persistent-hint
            ></v-text-field>

            <v-text-field
              v-model="form.imageUrl"
              label="Image URL"
              placeholder="https://..."
              hint="Optional (Default: SpaceX Placeholder)"
              persistent-hint
              class="mt-2"
            ></v-text-field>
          </v-form>
          <small class="text-caption text-medium-emphasis mt-2 d-block"
            >* indicates required field</small
          >
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeDialog"
            >Cancel</v-btn
          >
          <v-btn color="primary" variant="elevated" @click="submitRocket"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useRocketStore } from "@/stores/rocketStore";
import RocketCard from "@/components/RocketCard.vue";
import type { Rocket } from "@/types/rocket";

const store = useRocketStore();
const filter = ref("");
const dialog = ref(false);
const rocketForm = ref<any>(null);

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const form = reactive({
  name: "",
  description: "",
  country: "",
  cost: null as number | null,
  imageUrl: "",
});

const rules = {
  required: (value: string) => !!value || "This field is required.",
  minLength: (value: string) =>
    (value && value.length >= 10) ||
    "Description must be at least 10 characters.",
};

onMounted(() => {
  if (store.rockets.length === 0) store.loadData();
});

const filteredRockets = computed(() => {
  return store.rockets.filter((r) =>
    r.name.toLowerCase().includes(filter.value.toLowerCase()),
  );
});

const closeDialog = () => {
  dialog.value = false;
  rocketForm.value?.reset();
};

const submitRocket = async () => {
  const { valid } = await rocketForm.value.validate();

  if (!valid) return;

  const finalImage =
    form.imageUrl.trim() !== "" ? form.imageUrl : DEFAULT_IMAGE;

  const newRocket: Rocket = {
    id: Date.now().toString(),
    name: form.name,
    description: form.description,
    flickr_images: [finalImage],
    cost_per_launch: form.cost || 0,
    country: form.country,
    first_flight: new Date().toISOString().split("T")[0],
  };

  store.addRocket(newRocket);
  closeDialog();
};
</script>
