<template>
    <v-container v-if="rocket">

        <v-img :src="rocket.flickr_images[0]" height="300" />

        <h1>{{ rocket.name }}</h1>
        <p>{{ rocket.description }}</p>

        <p>💰 Cost: {{ rocket.cost_per_launch }}</p>
        <p>🌍 Country: {{ rocket.country }}</p>
        <p>🚀 First Flight: {{ rocket.first_flight }}</p>

    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchRocketById } from '@/services/spacexService'

const route = useRoute()
const rocket = ref<any>(null)

onMounted(async () => {
    rocket.value = await fetchRocketById(route.params.id as string)
})
</script>