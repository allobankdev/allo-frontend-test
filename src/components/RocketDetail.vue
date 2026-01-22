<template>
    <p v-if="loading">Loading rocket details...</p>
    <p v-else-if="error">{{ error }}</p>
    <div v-else>
        <h1>{{ rockets[0]?.name }}</h1>
        <v-container>
            <v-row class="d-flex flex-nowrap justify-center" style="overflow-x: auto;">
                <v-col v-for="(img, index) in rockets[0]?.flickr_images" :key="index" class="flex-shrink-0"
                    style="max-width: 300px;">
                    <v-img :src="resolveImage(img)" height="200" cover class="rounded"></v-img>
                </v-col>
            </v-row>
        </v-container>
        <v-table>
            <thead>
                <tr>
                    <th class="text-center">
                        Description
                    </th>
                    <th class="text-center">
                        Cost Per Launch
                    </th>
                    <th class="text-center">
                        Country
                    </th>
                    <th class="text-center">
                        First Flight
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ rockets[0]?.description }}</td>
                    <td>{{ rockets[0]?.cost_per_launch }}</td>
                    <td>{{ rockets[0]?.country }}</td>
                    <td>{{ rockets[0]?.first_flight }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
    <v-btn class="text-none text-subtitle-1" color="primary" size="small" variant="flat" :to="`/rockets`">
        Back
    </v-btn>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRocket } from '@/composables/rocket'
import { useRoute } from 'vue-router'
import { useImageResolver } from "@/composables/useImageResolver";

const { resolveImage } = useImageResolver();

const route = useRoute()
const rocketStore = useRocket()
rocketStore.fetchRocketsById(route.params.id)
const { rockets, loading, error } = storeToRefs(rocketStore)
</script>