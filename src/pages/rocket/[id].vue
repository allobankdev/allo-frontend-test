<template>
    <div class="rocket-detail-page">
        <div class="container">
            <!-- Loading State -->
            <LoadingSpinner v-if="loading" message="Loading rocket details..." />

            <!-- Error State -->
            <ErrorState v-else-if="error" :message="error" @retry="handleRetry" />

            <!-- Rocket Detail Content -->
            <template v-else-if="rocket">
                <!-- Back Button -->
                <button @click="handleBack" class="back-button">
                    <span class="back-icon">←</span>
                    Back to List
                </button>

                <!-- Rocket Header -->
                <div class="rocket-header">
                    <div class="rocket-header-content">
                        <div class="rocket-title-section">
                            <h1 class="rocket-title">{{ rocket.name }}</h1>
                            <span v-if="rocket.active" class="status-badge active">Active</span>
                            <span v-else class="status-badge inactive">Inactive</span>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="content-layout">
                    <!-- Images Section -->
                    <section class="images-section">
                        <div class="main-image">
                            <img :src="currentImage" :alt="rocket.name" loading="lazy" @error="handleImageError" />
                        </div>
                        <div v-if="rocket.flickr_images.length > 1" class="image-thumbnails">
                            <button v-for="(image, index) in rocket.flickr_images" :key="index"
                                @click="currentImageIndex = index"
                                :class="['thumbnail', { active: currentImageIndex === index }]">
                                <img :src="image" :alt="`${rocket.name} ${index + 1}`" loading="lazy" />
                            </button>
                        </div>
                    </section>

                    <!-- Details Section -->
                    <section class="details-section">
                        <div class="detail-card">
                            <h2 class="section-title">Description</h2>
                            <p class="description-text">{{ rocket.description }}</p>
                        </div>

                        <div class="detail-card">
                            <h2 class="section-title">Details</h2>
                            <div class="details-list">
                                <div class="detail-item">
                                    <span class="detail-label">Country</span>
                                    <span class="detail-value">{{ rocket.country }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Cost per Launch</span>
                                    <span class="detail-value">{{ formattedCost }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">First Flight</span>
                                    <span class="detail-value">{{ formattedDate }}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </template>

            <!-- Not Found State -->
            <div v-else class="not-found">
                <div class="not-found-icon">🚀</div>
                <h2>Rocket Not Found</h2>
                <p>The rocket you're looking for doesn't exist.</p>
                <button @click="handleBack" class="btn-primary">
                    Back to List
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import { formatCostUSD, formatDate } from '@/utils/common'

const route = useRoute()
const router = useRouter()
const rocketStore = useRocketStore()

const loading = ref(true)
const error = ref<string | null>(null)
const currentImageIndex = ref(0)

const rocketId = computed(() => route.params.id as string)

const rocket = computed(() => {
    return rocketStore.getRocketById(rocketId.value)
})

const currentImage = computed(() => {
    if (!rocket.value || rocket.value.flickr_images.length === 0) {
        return 'https://via.placeholder.com/800x600?text=No+Image'
    }
    return rocket.value.flickr_images[currentImageIndex.value]
})

const formattedCost = computed(() => {
    if (!rocket.value) return '0'
    return formatCostUSD(rocket.value.cost_per_launch)
})

const formattedDate = computed(() => {
    if (!rocket.value) return ''
    return formatDate(rocket.value.first_flight)
})

onMounted(async () => {
    loading.value = true
    error.value = null

    try {
        // If store is empty, fetch rockets first
        if (rocketStore.rockets.length === 0) {
            await rocketStore.fetchRockets()
        }

        // Check if rocket exists
        if (!rocket.value) {
            error.value = 'Rocket not found'
        }
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to load rocket'
    } finally {
        loading.value = false
    }
})

const handleBack = () => {
    router.push('/')
}

const handleRetry = async () => {
    loading.value = true
    error.value = null
    try {
        await rocketStore.fetchRockets()
        if (!rocket.value) {
            error.value = 'Rocket not found'
        }
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to load rocket'
    } finally {
        loading.value = false
    }
}

const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = 'https://via.placeholder.com/800x600?text=No+Image'
}
</script>

<style scoped>
.rocket-detail-page {
    min-height: 100vh;
    background: #f9fafb;
    padding: 2rem 0;
}

.container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
}

.back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background-color: white;
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 2rem;
}

.back-button:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
}

.back-icon {
    font-size: 1.25rem;
    line-height: 1;
}

.rocket-header {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.rocket-title-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.rocket-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0;
}

.status-badge {
    padding: 0.375rem 0.875rem;
    border-radius: 9999px;
    font-size: 0.875rem;
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

.content-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.images-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.main-image {
    background: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    aspect-ratio: 4/3;
}

.main-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-thumbnails {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
}

.thumbnail {
    flex-shrink: 0;
    width: 80px;
    height: 60px;
    border-radius: 0.375rem;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;
    background: white;
}

.thumbnail:hover {
    border-color: #3b82f6;
}

.thumbnail.active {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.details-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.detail-card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem 0;
}

.description-text {
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
}

.details-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.detail-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.detail-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
}

.detail-value {
    font-size: 1rem;
    color: #1f2937;
    font-weight: 600;
}

.not-found {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.not-found-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.not-found h2 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
}

.not-found p {
    color: #6b7280;
    margin: 0 0 1.5rem 0;
}

.btn-primary {
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: #2563eb;
}

/* Responsive */
@media (max-width: 1024px) {
    .content-layout {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .rocket-title {
        font-size: 2rem;
    }
}
</style>