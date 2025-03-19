<template>
  <v-container class="container">
    <v-card color="blue" variant="outlined" class="pa-4" width="600">
      <v-card-title>Add New Rocket</v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="submitRocket">
          <v-text-field
            v-model="rocket.name"
            label="Rocket Name"
            :rules="[rules.required]"
          />

          <v-text-field
            v-model="rocket.links.patch.small"
            label="Rocket Image URL"
            :rules="[rules.required]"
          />

          <v-text-field
            v-model="rocket.date_local"
            label="First Launch Date"
            type="date"
            :rules="[rules.required]"
          />

          <v-textarea v-model="rocket.details" label="Description" />
          <div class="container-button">
            <v-btn color="blue" @click="submitRocket">Add Rocket</v-btn>
            <v-btn color="blue" variant="outlined" @click="handleCancel" >Cancel</v-btn>

          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRocketStore } from "../stores/rocketStore";
import type { Rocket } from "../types/Rocket";
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

const rocketStore = useRocketStore();
const router = useRouter();
const form = ref<InstanceType<typeof VForm> | null>(null);

const rocket = ref<Rocket>({
  id: crypto.randomUUID(),
  name: "",
  rocket: "",
  links: {
    patch: { small: "" },
  },
  flickr: { original: [] },
  details: "",
  date_local: new Date(),
});

const rules = {
  required: (value: string) => !!value || "Field is required",
};

const handleCancel = () =>{
  router.back();
}

const submitRocket = async () => {
  if (!form.value) return;
  const isValid = await form.value.validate();
  if (!isValid.valid) return;
  rocketStore.addRocket(rocket.value);
  router.push("/");
};
</script>

<style lang="scss" scoped>
.container {
  justify-items: center;
  padding-top: 100px;
  &-button{
    margin-top: 2px;
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
}
</style>
