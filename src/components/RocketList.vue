<script setup lang="ts">
import RocketCard from '@/components/RocketCard.vue'
import type { Rocket } from '@/types/rocket'

defineProps<{
    rockets: Rocket[]
}>()
</script>

<template>
    <div class="row row-cols-3 g-2">
        <RocketCard v-for="rocket in rockets" :key="rocket.id" :rocket="rocket" />
    </div>
</template>