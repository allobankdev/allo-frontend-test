<template>
    <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <div class="content-center" v-if="rocketDetail">
                <div class="">
                    <!-- <img :src="rocketDetail.image_url" @error="handleImageError" :alt="rocketDetail.full_name" class="table-img" /> -->
                     {{ userId }}
                </div>
            </div>
        </v-responsive>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRocketStore } from '@/stores/rocketStore';
import type { Result } from '@/types/types';

const route = useRoute()
const userId = computed(() => Number(route.query.id)).value
const rocketStore = useRocketStore()
const rocketDetail = ref<Result>()

onMounted(() => {
    rocketDetail.value = rocketStore.getResultById(userId)
})
</script>
