<template>
    <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <input v-model="query" type="text" placeholder="Search..." />

            <div class="content-center" v-if="rocketStore.loading">Loading...</div>

            <div class="content-center" v-if="rocketStore.exception">
                <p>{{ rocketStore.exception }}</p>
                <button @click="rocketStore.getData">Reload</button>
            </div>

            <ul class="content-center" v-if="filterResults.length">
                <li v-for="result in filterResults" :key="result.id">
                    {{ result.full_name }}
                </li>
                <!-- <router-link :to></router-link> -->
            </ul>
        </v-responsive>
    </v-container>
</template>

<script setup lang="ts">
import type { RocketData, Result } from '@/types/types';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue'
import { useRocketStore } from '@/stores/rocketStore';

const rocketStore = useRocketStore()
const query = ref('')

const filterResults = computed<Result[]>(() => {
    if (query.value) {
        return rocketStore.data?.results?.filter(result => result.full_name.toLowerCase().includes(query.value.toLowerCase())) || []
    }
    return rocketStore.data?.results || []
})

onMounted(() => {
    rocketStore.getData()
})
</script>
