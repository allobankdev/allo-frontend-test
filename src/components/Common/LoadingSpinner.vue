<template>
    <div class="loading-skeleton" role="status" aria-live="polite">
        <div class="skeleton-grid">
            <div v-for="n in count" :key="n" class="skeleton-card">
                <div class="skeleton-image shimmer"></div>
                <div class="skeleton-content">
                    <div class="skeleton-title shimmer"></div>
                    <div class="skeleton-line shimmer short"></div>
                    <div class="skeleton-line shimmer"></div>

                    <div class="skeleton-meta">
                        <div class="skeleton-badge shimmer"></div>
                        <div class="skeleton-badge shimmer short"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    count?: number
}

withDefaults(defineProps<Props>(), {
    count: 6
})
</script>

<style scoped>
.loading-skeleton {
    padding: 0 0;
}

.skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
}

.skeleton-card {
    background: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.skeleton-image {
    width: 100%;
    height: 200px;
    background: #e5e7eb;
}

.skeleton-content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.skeleton-title {
    height: 20px;
    width: 60%;
    border-radius: 6px;
    background: #e5e7eb;
}

.skeleton-line {
    height: 12px;
    width: 100%;
    border-radius: 6px;
    background: #e5e7eb;
}

.skeleton-line.short {
    width: 80%;
}

.skeleton-meta {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
}

.skeleton-badge {
    height: 28px;
    width: 28%;
    border-radius: 9999px;
    background: #e5e7eb;
}

/* Shimmer */
.shimmer {
    position: relative;
    overflow: hidden;
}

.shimmer::after {
    content: '';
    position: absolute;
    top: 0;
    left: -150%;
    width: 150%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0) 100%);
    transform: translateX(0);
    animation: shimmer 1.2s ease-in-out infinite;
}

@keyframes shimmer {
    to {
        transform: translateX(150%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .shimmer::after {
        animation: none;
    }
}

/* Responsive fallback for small screens */
@media (max-width: 768px) {
    .skeleton-grid {
        grid-template-columns: 1fr;
    }
}
</style>