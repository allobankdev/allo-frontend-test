<template>
  <v-card class="mb-6">
    <v-card-title>
      Add Rocket
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="name"
        label="Rocket name"
      />

      <v-textarea
        v-model="description"
        label="Description"
      />

      <v-btn @click="addRocket">
        Add Rocket
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"

const name = ref("")
const description = ref("")

const emit = defineEmits<{
  add: [
    rocket: {
      name: string
      description: string
    }
  ]
}>()

function addRocket() {
  emit("add", {
    name: name.value,
    description: description.value,
  })

  name.value = ""
  description.value = ""
}
</script>