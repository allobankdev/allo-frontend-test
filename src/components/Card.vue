<template>
    <div class="card shadow-sm">
        <div class="row">
            <div class="col-md-4 d-flex flex-column align-items-center border-end">
                 <router-link :to="{ name: '/detail/', query: { id: id } }">
                     <fallback-image :src="imageUrl" :alt="title" />
                 </router-link>
            </div>

            <div class="col-md-8 d-flex align-items-center">
                <div class="card-body">
                    <h5 class="card-title">{{ title }}</h5>
                    <p class="card-text">{{ description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import FallbackImage from './FallbackImage.vue';

defineProps<{
    id: number,
    imageUrl: string,
    title: string,
    description: string
}>()
</script>