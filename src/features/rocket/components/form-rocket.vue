<template>
  <!-- <p>isOpen: {{ isOpen }}</p>
  <p>props: {{ $props.isOpen }}</p> -->
  <v-dialog
    :model-value="$props.isOpen"
    @update:model-value="closeModal"
    max-width="500"
  >
    <v-card class="pa-4">
      <v-card-title>Add New Rocket</v-card-title>
      <v-card-item>
        <form action="">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Rocket Name"
                v-model="formRocket.name"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="First Flight"
                v-model="formRocket.first_flight"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Country"
                v-model="formRocket.country"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Cost Per Launch"
                v-model="formRocket.cost_per_launch"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <input type="file" accept="image/jpeg, image/png" />
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Description"
                v-model="formRocket.description"
                variant="outlined"
              ></v-textarea>
            </v-col>
          </v-row>
        </form>
      </v-card-item>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="outlined" @click="closeModal">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="flat"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Rocket } from "../types/rocket.dto";
interface Props {
  isOpen: boolean;
}
const $props = defineProps<Props>();
const $emit = defineEmits<{
  (e: "closeModal"): void;
}>();
const formRocket = ref<Rocket>({} as Rocket);

const closeModal = () => {
  formRocket.value = {} as Rocket;
  $emit("closeModal");
};
</script>
