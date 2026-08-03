<template>
    <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <input v-model="query" type="text" placeholder="Search..." />

            <div class="content-center" v-if="loading">Loading...</div>

            <div class="content-center" v-if="exception">
                <p>{{ exception }}</p>
                <button @click="getData">Reload</button>
            </div>

            <ul class="content-center" v-if="data.length">
                <li v-for="d in data" :key="d.name">
                    {{ d.name }}
                </li>
                <!-- <router-link :to></router-link> -->
            </ul>
        </v-responsive>
    </v-container>
</template>

<script setup lang="ts">
import type { RocketData } from '@/types/types';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue'

const data = ref<RocketData[]>([])
const loading = ref(false)
const exception = ref('')
const query = ref('')

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

        data.value = [
            { name: 'A' },
            { name: 'B' },
            { name: 'C' }
        ]
        exception.value = ''
    } finally {
        data.value = data.value.filter(d => d.name.toLowerCase().includes(query.value.toLowerCase()))
        loading.value = false
    }
}

onMounted(() => {
    getData()
})
</script>
