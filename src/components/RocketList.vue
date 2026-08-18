<template>
    <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <div class="search-bar">
                <input :disabled="rocketStore.loading" v-model="query" type="text" placeholder="Search..." />
            </div>
            <div>
                <input-rocket-modal :is-loading="rocketStore.loading" @close="showModal = false" />
            </div>

            <div class="content-center" v-if="rocketStore.loading">Loading...</div>

            <div class="content-center" v-if="rocketStore.exception">
                <p>{{ rocketStore.exception }}</p>
                <button @click="rocketStore.getData">Reload</button>
            </div>

            <div v-if="filterResults.length">
                <div class="content-center" v-if="filterResults.length">
                    <div class="container rounded-start cards-overflow">
                        <div class="vstack gap-3">
                            <card v-for="(result, index) in filterResults" :key="result.id" :id="result.id" :image-url="result.image_url" :title="result.full_name" :description="result.description" />
                        </div>
                    </div>
                </div>
            </div>
        </v-responsive>
    </v-container>
</template>

<script setup lang="ts">
import type { Result } from '@/types/types';
import { ref, onMounted, computed } from 'vue'
import { useRocketStore } from '@/stores/rocketStore';
import InputRocketModal from './InputRocketModal.vue';
import Card from './Card.vue';

const rocketStore = useRocketStore()
const query = ref('')
const showModal = ref(false);

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
