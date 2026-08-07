<template>
    <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <div class="content-center" v-if="rocketDetail">
                <div class="">
                    <fallback-image :src="rocketDetail.image_url" :alt="rocketDetail.full_name" />
                </div>
                <div class="">
                    {{ rocketDetail.full_name }}
                </div>
                <div class="">
                    {{ formatAmountToUsd(rocketDetail.launch_cost) }}
                </div>
                <div class="">
                    {{ rocketDetail.manufacturer.country_code }}
                </div>
                <div class="">
                    {{ rocketDetail.maiden_flight }}
                </div>
            </div>
        </v-responsive>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRocketStore } from '@/stores/rocketStore';
import type { Result } from '@/types/types';

const route = useRoute()
const router = useRouter()
const userId = computed(() => Number(route.query.id)).value
const rocketStore = useRocketStore()
const rocketDetail = ref<Result>()

function formatAmountToUsd(amount: string | null): string {
    const defaultResponse = 'Unknown'
    if (!amount) return defaultResponse

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount)) return defaultResponse

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(numericAmount);
}

onMounted(() => {
    rocketDetail.value = rocketStore.getResultById(userId)
    if(rocketDetail.value === undefined) router.push('/')
})
</script>
