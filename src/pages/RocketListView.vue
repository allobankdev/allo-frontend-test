<template>
    <v-container>

        <v-text-field v-model="search" label="Search Rocket" />

        <AddRocketForm @add="addRocket"/>
        
        <LoadingState v-if="loading" />

        <ErrorState v-if="error" :message="error" @retry="loadRockets" />

        <v-row v-if="!loading && !error">
            <v-col v-for="r in filteredRockets" :key="r.id" cols="12" md="4" class="mt-4">
                <RocketCard :rocket="r" @click="goDetail(r.id)" />
            </v-col>
        </v-row>

    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import RocketCard from '@/components/RocketCard.vue'
import LoadingState from '@/components/LoadingState.vue'
import { useRocketStore } from '@/store/rocketStore'
import ErrorState from '@/components/ErrorState.vue'
import AddRocketForm from '@/components/AddRocketForm.vue'

const { rockets, loading, error, loadRockets, addRocket } = useRocketStore()

const router = useRouter()
const search = ref('')

onMounted(loadRockets)

const filteredRockets = computed(() =>
    rockets.value.filter(r =>
        r.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

function goDetail(id: string) {
    router.push(`/rocket/${id}`)
}

</script>