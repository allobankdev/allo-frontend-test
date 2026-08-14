<template>
  <v-card
    class="mb-4"
    max-width="500"
    @click="goToDetail"
  >
    <v-img
      v-if="rocket.image_url"
      :src="rocket.image_url"
      height="250"
      cover
    />

    <div
      v-else
      style="height: 250px; display: flex; align-items: center; justify-content: center;"
    >
      No image available
    </div>

    <v-card-title>
      {{ rocket.full_name }}
    </v-card-title>

    <v-card-text>
      {{ rocket.description || "No description available" }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import type { Rocket } from "@/types/rocket"

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

function goToDetail() {
  if (props.rocket.isLocal) {
    alert("No detail data is available for this rocket.")
    return
  }

  router.push(`/rockets/${props.rocket.id}`)
}
</script>