<template>
  <v-form ref="refForm" @submit.prevent="submit" class="pa-12">
    <v-text-field
      v-model="rocketStore.name"
      :rules="rules"
      label="Name"
    ></v-text-field>
    <v-textarea
      v-model="rocketStore.description"
      :rules="rules"
      label="Description"
    ></v-textarea>
    <v-text-field
      v-model="rocketStore.costPerLaunch"
      :rules="rules"
      label="Cost Per Launch"
    ></v-text-field>
    <v-text-field
      v-model="rocketStore.country"
      :rules="rules"
      label="Country"
    ></v-text-field>
    <v-text-field
      v-model="rocketStore.firstFlight"
      :rules="rules"
      label="First Flight"
    ></v-text-field>
    <v-text-field
      v-model="rocketStore.image"
      :rules="rules"
      label="Image URL"
    ></v-text-field>
    <v-btn class="mt-2" type="submit" block>Submit</v-btn>
  </v-form>
</template>

<script setup>
  import { useRocketStore } from "@/stores/RocketStore";
  import { ref } from "vue";

  const rocketStore = useRocketStore();
  const rules = [v => !!v || 'Field is required'];
  const refForm = ref();

  function submit() {
    refForm.value?.validate().then(async ({ valid: isValid }) => {
    if (isValid) {
      rocketStore.addRocket();
    }
  });
  }
</script>
