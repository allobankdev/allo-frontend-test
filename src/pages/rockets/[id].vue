<template>
    <v-container>
        <v-btn prepend-icon="mdi-arrow-left" variant="text" class="mb-4" to="/">
            Back to list
        </v-btn>

        <div v-if="status === 'loading'" class="d-flex justify-center py-16">
            <v-progress-circular indeterminate size="48"/>
        </div>

         <v-alert v-else-if="status === 'error'" type="error">
            <div class="d-flex align-center justify-space-between flex-wrap ga-2">
                <span>Failed to load rocket detail</span>
                <v-btn @click="retry">Retry</v-btn>
            </div>
         </v-alert>

         <v-card v-else-if="rocket" rounded="lg" max-width="800">
            <v-img v-if="rocket.image" :src="rocket.image" height="300" cover/>

            <div v-else
                class="d-flex align-center justify-center bg-surface-variant"
                style="height : 300px"
            >
                <v-icon icon="mdi-rocket-launch" size="64" />
            </div>

            <v-card-title class="text-h4">{{ rocket.name }}</v-card-title>
            <v-card-text>
                <p class="mb-4">{{ rocket.description }}</p>

                 <div class="d-flex ga-2 mb-1">
                    <span class="font-weight-medium">Cost per launch:</span>
                    <span>{{ formatCost(rocket.launchCost) }}</span>
                </div>

                <div class="d-flex ga-2 mb-1">
                    <span class="font-weight-medium">Country:</span>
                    <span>{{ rocket.country ?? '—' }}</span>
                </div>

                 <div class="d-flex ga-2 mb-1">
                    <span class="font-weight-medium">First flight:</span>
                    <span>{{ rocket.firstFlight ?? '—' }}</span>
                </div>
            </v-card-text>
         </v-card>

    </v-container>
</template>

<script lang="ts" setup>
import { fetchRocketById } from '@/services/rocketService';
import { useRockets } from '@/stores/rockets';
import type { Rocket } from '@/types/rocket';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';   


const route = useRoute();
const { allRockets } = useRockets();
type Status = 'loading' | 'error' | 'success';
const status = ref<Status>('loading');
const rocket = ref<Rocket | null>(null);

function formatCost(cost : string | null) : string {
    if(cost === null)return '—';
    return `$${Number(cost).toLocaleString('en-US')}`;

}

async function load(){
    const id = String(route.params.id);

    status.value = 'loading';
    rocket.value = null;

    const fromStore = allRockets.value.find((item) => item.id === id);
    if(fromStore){
        rocket.value = fromStore;
        status.value = 'success';
        return
    }
    try {
        rocket.value = await fetchRocketById(id);
        status.value = 'success';
    }catch {
        rocket.value = null;
        status.value = 'error';
    }
}

function retry(){
    load()
}

onMounted(() => {
    load()
})


</script>