<template>
  <v-container>
    <div
    v-if="loading"
    class="d-flex flex-column justify-center align-center"
    style="min-height: 300px;"
    >
    <v-progress-circular
        indeterminate
        size="64"
        width="6"
    />

    <p class="mt-4">
        Loading rocket...
    </p>
    </div>

    <div v-else-if="error">
      <p>Failed to load rocket.</p>

      <v-btn @click="fetchRocket">
        Retry
      </v-btn>
    </div>

    <div v-else-if="rocket">
    <v-btn
        prepend-icon="mdi-arrow-left"
        class="mb-6"
        @click="$router.back()"
    >
        Back
    </v-btn>

    <v-card>
        <v-img
        v-if="rocket.image_url"
        :src="rocket.image_url"
        height="400"
        cover
        />

        <div
        v-else
        style="
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
        "
        >
        No image available
        </div>

        <v-card-title class="text-h4">
        {{ rocket.full_name }}
        </v-card-title>

        <v-card-text>
        <p class="mb-6">
            {{ rocket.description ?? "No description available" }}
        </p>

        <v-row>
            <v-col cols="12" sm="4">
            <strong>Cost per launch</strong>
            <div>
                {{ rocket.launch_cost != null
                ? `$${rocket.launch_cost.toLocaleString()}`
                : "Not available"
                }}
            </div>
            </v-col>

            <v-col cols="12" sm="4">
            <strong>Country</strong>
            <div>
                {{ rocket.manufacturer?.country_code ?? "Not available" }}
            </div>
            </v-col>

            <v-col cols="12" sm="4">
            <strong>First flight</strong>
            <div>
                {{ rocket.maiden_flight ?? "Not available" }}
            </div>
            </v-col>
        </v-row>
        </v-card-text>
    </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import type { Rocket } from "@/types/rocket"

const route = useRoute()

const rocket = ref<Rocket | null>(null)
const loading = ref(true)
const error = ref(false)

async function fetchRocket() {
  loading.value = true
  error.value = false

  try {
    const response = await fetch(
      `https://lldev.thespacedevs.com/2.2.0/config/launcher/${route.params.id}/`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch rocket")
    }

    rocket.value = await response.json()
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRocket()
})
</script>