<template>
    <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <div v-if="loading">Loading...</div>

            <div v-if="exception">{{ exception }}</div>

            <ul v-if="data.length">
                <li v-for="d in data" :key="d.rocket">
                    {{ d.rocket }}
                </li>
            </ul>
        </v-responsive>
    </v-container>
</template>

<script setup lang="ts">
import type { RocketData } from '@/types/types';
import axios from 'axios';
import { ref, onMounted } from 'vue'

const data = ref<RocketData[]>([])
const loading = ref(false)
const exception = ref('')

async function getData() {
    loading.value = true
    exception.value = ''

    try {
        const res = await axios.get('https://api.spacexdata.com/v5/launches/latest')
        data.value = res.data
    } catch (error) {
        if (error instanceof Error) {
            exception.value = 'Get data failed: ' + error.message
        } else {
            exception.value = 'Unknown error: ' + error
        }
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    getData()
})
</script>
