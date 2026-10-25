<template>
    <div>
        <p v-if="rocketStore.loading">Loading ...</p>
        <p v-else-if="rocketStore.error">
            Error: {{ rocketStore.error }}
            <button type="button" @click="rocketStore.fetchRockets">Retry</button>
        </p>
        <div v-else-if="rocket">
            <v-card>
                <v-img v-if="rocket.image_url && !imageError" :src="rocket.image_url" height="200" cover
                    @error="imageError = true" />
                <div v-else
                    style="height: 200px; display: flex; align-items: center; justify-content: center; background: #eee;">
                    No Image available
                </div>
                <v-card-title>{{ rocket.full_name }}</v-card-title>
                <v-card-text>{{ rocket.description ?? 'Description not Available' }}</v-card-text>

                <v-divider class="my-2" />

                <v-list density="compact">
                    <v-list-item>
                        <v-list-item-title>Cost per Launch</v-list-item-title>
                        <v-list-item-subtitle>{{ formatCurrency(rocket.launch_cost)
                        }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>Country</v-list-item-title>
                        <v-list-item-subtitle>{{ rocket.manufacturer.country_code }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>Maiden Flight</v-list-item-title>
                        <v-list-item-subtitle>{{ rocket.maiden_flight ?? 'N/A' }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>Manufacture Name</v-list-item-title>
                        <v-list-item-subtitle>{{ rocket.manufacturer.name }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>

            </v-card>
        </div>
        <p v-else>Rocket not found</p>
    </div>
</template>
<script lang="ts" setup>
import { useRocketStore } from '@/stores/rocket';
import { formatCurrency } from '@/utils/formatCurrency';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const rocketStore = useRocketStore();
const imageError = ref(false);

const rocket = computed(() => {
    return rocketStore.rockets.find((r) => r.id === Number(route.params.id));
});

onMounted(() => {
    if (!rocket.value) {
        rocketStore.fetchRocketsById(Number(route.params.id));
    }
})

</script>