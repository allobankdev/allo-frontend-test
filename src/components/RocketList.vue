<template>
    <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <input v-model="query" type="text" placeholder="Search..." />

            <div class="content-center" v-if="rocketStore.loading">Loading...</div>

            <div class="content-center" v-if="rocketStore.exception">
                <p>{{ rocketStore.exception }}</p>
                <button @click="rocketStore.getData">Reload</button>
            </div>

            <div class="content-center" v-if="filterResults.length">
                <div class="table-container">
                    <table class="image-table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Rocket</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(result, index) in filterResults" :key="result.id">
                                <td>{{ index + 1 }}</td>
                                <td>
                                    <router-link :to="{ name: '/detail/', query: { id: result.id } }">
                                        <div class="cell-content">
                                            <fallback-image :src="result.image_url" :alt="result.full_name" />
                                            <span class="table-text">
                                                {{ result.full_name }}
                                            </span>
                                        </div>
                                    </router-link>
                                </td>
                                <td>{{ result.description }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </v-responsive>
    </v-container>
</template>

<script setup lang="ts">
import type { RocketData, Result } from '@/types/types';
import { ref, onMounted, computed } from 'vue'
import { useRocketStore } from '@/stores/rocketStore';
// import fallback from '@/assets/logo.png';
import FallbackImage from './FallbackImage.vue';

const rocketStore = useRocketStore()
const query = ref('')

// function handleImageError(event: Event) {
//     const target = event.target as HTMLInputElement
//     target.src = fallback
// }

const filterResults = computed<Result[]>(() => {
    if (query.value) {
        return rocketStore.data?.results?.filter(result => result.full_name.toLowerCase().includes(query.value.trim().toLowerCase())) || []
    }
    return rocketStore.data?.results || []
})

onMounted(() => {
    rocketStore.getData()
})
</script>
