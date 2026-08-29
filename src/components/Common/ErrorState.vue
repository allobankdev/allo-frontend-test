<template>
    <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">{{ title }}</h3>
        <p class="error-message">{{ message }}</p>
        <button v-if="showRetry" @click="handleRetry" class="retry-button">
            {{ retryText }}
        </button>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title?: string
    message?: string
    showRetry?: boolean
    retryText?: string
}

interface Emits {
    (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Something went wrong',
    message: 'An error occurred while loading data. Please try again.',
    showRetry: true,
    retryText: 'Retry'
})

const emit = defineEmits<Emits>()

const handleRetry = () => {
    emit('retry')
}
</script>

<style scoped>
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
}

.error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.error-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
}

.error-message {
    color: #6b7280;
    margin: 0 0 1.5rem 0;
    max-width: 400px;
}

.retry-button {
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.retry-button:hover {
    background-color: #2563eb;
}

.retry-button:active {
    background-color: #1d4ed8;
}
</style>