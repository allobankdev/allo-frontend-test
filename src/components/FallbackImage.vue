<template>
    <img :src="src" @error="handleImageError" :alt="alt" class="table-img" />
</template>

<script setup lang="ts">
import fallback from '@/assets/logo.png';

const props = defineProps({
    src: {
        type: String,
        default: ''
    },
    fallback: {
        type: String,
        default: fallback
    },
    alt: {
        type: String,
        default: 'Image Placeholder'
    }
})

function handleImageError(event: Event) {
    const target = event.target as HTMLInputElement
    target.src = fallback
}
</script>