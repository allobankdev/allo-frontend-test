<template>
    <div class="rocket-card" @click="handleClick">
        <div class="rocket-image">
            <img :src="rocket.flickr_images[0] || '/placeholder-rocket.jpg'" :alt="rocket.name" loading="lazy"
                @error="handleImageError" />
            <span v-if="rocket.active" class="status-badge active">Active</span>
            <span v-else class="status-badge inactive">Inactive</span>
        </div>

        <div class="rocket-content">
            <h3 class="rocket-name">{{ rocket.name }}</h3>
            <p class="rocket-description">{{ truncatedDescription }}</p>

            <div class="rocket-meta">
                <span class="meta-item">
                    <span class="meta-label">Country:</span>
                    <span class="meta-value">{{ rocket.country }}</span>
                </span>
                <span class="meta-item">
                    <span class="meta-label">Cost:</span>
                    <span class="meta-value">{{ formattedCost }}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'
import { formatCostUSD } from '@/utils/common';

interface Props {
    rocket: Rocket
}

const props = defineProps<Props>()
const router = useRouter()

const truncatedDescription = computed(() => {
    const maxLength = 120
    if (props.rocket.description.length <= maxLength) {
        return props.rocket.description
    }
    return props.rocket.description.substring(0, maxLength) + '...'
})

const formattedCost = computed(() => {
    return formatCostUSD(props.rocket.cost_per_launch)
})

const handleClick = () => {
    router.push(`/rocket/${props.rocket.id}`)
}

const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = 'https://via.placeholder.com/400x300?text=No+Image'
}
</script>

<style scoped>
.rocket-card {
    background: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.rocket-card:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
}

.rocket-image {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: #f3f4f6;
}

.rocket-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.status-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-badge.active {
    background-color: #10b981;
    color: white;
}

.status-badge.inactive {
    background-color: #6b7280;
    color: white;
}

.rocket-content {
    padding: 1.25rem;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.rocket-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
}

.rocket-description {
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0 0 1rem 0;
    flex: 1;
}

.rocket-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    padding-top: 0.75rem;
    border-top: 1px solid #e5e7eb;
}

.meta-item {
    display: flex;
    gap: 0.25rem;
    font-size: 0.875rem;
}

.meta-label {
    color: #6b7280;
    font-weight: 500;
}

.meta-value {
    color: #1f2937;
    font-weight: 600;
}
</style>