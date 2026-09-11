<template>
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        prepend-icon="mdi-plus"
        text="Add Rocket"
        size="small"
        color="primary"
        v-bind="activatorProps"
      ></v-btn>
    </template>

    <v-card title="Add Rocket">
      <v-card-text>
        <v-text-field
          v-model="rocketName"
          label="Rocket Name*"
          required
        ></v-text-field>
        <v-textarea
          v-model="rocketDesc"
          label="Description"
          rows="2"
        ></v-textarea>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

        <v-btn
          color="primary"
          text="Save"
          variant="tonal"
          @click="handleSave"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useRocketStore } from "@/stores/rocket";
import type { RocketData } from "@/types";
import { ref, shallowRef } from "vue";

const dialog = shallowRef(false);
const rocketStore = useRocketStore();

const rocketName = ref("");
const rocketDesc = ref("");

const handleSave = () => {
  if (!rocketName.value) {
    alert("Please fill in the rocket name.");
    return;
  }

  const dataToSave: RocketData = {
    full_name: rocketName.value,
    description: rocketDesc.value,
  };

  // Menambahkan data ke store
  rocketStore.addData(dataToSave);

  rocketName.value = "";
  rocketDesc.value = "";

  dialog.value = false;
};
</script>
