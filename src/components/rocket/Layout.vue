<template>
  <div>
    <v-app-bar color="blue-lighten-2" position="fixed">
      <v-app-bar-title
        v-on:click="$router.push('/rocket')"
        class="cursor-pointer"
        >Rocket</v-app-bar-title
      >

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <slot></slot>

    <v-snackbar
      v-model="alertStatus"
      :timeout="3000"
      class="elevation-24"
      color="blue-lighten-2"
    >
      Rocket added successfully!
    </v-snackbar>
  </div>
</template>

<script>
import { useRocketStore } from "@/stores/rocket";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const rocketStore = useRocketStore();
    const { alertStatus } = storeToRefs(rocketStore);

    return {
      alertStatus,
    };
  },
};
</script>

<style></style>
