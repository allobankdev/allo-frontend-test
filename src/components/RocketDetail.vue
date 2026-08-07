<template>
    <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <div class="grid-main" v-if="rocketDetail">
                <div class="grid-row">
                    <div class="grid-cell-left">

                    </div>
                    <div class="grid-cell-right">
                        <fallback-image :src="rocketDetail.image_url" :alt="rocketDetail.full_name" />
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-cell-left">
                        Name
                    </div>
                    <div class="grid-cell-right">
                        {{ rocketDetail.full_name }}
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-cell-left">
                        Launch Cost
                    </div>
                    <div class="grid-cell-right">
                        {{ formatAmountToUsd(rocketDetail.launch_cost) }}
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-cell-left">
                        Country Code
                    </div>
                    <div class="grid-cell-right">
                        {{ rocketDetail.manufacturer?.country_code }}
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-cell-left">
                        First Flight
                    </div>
                    <div class="grid-cell-right">
                        {{ rocketDetail.maiden_flight }}
                    </div>
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
    const defaultResponse = 'unknown'
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
