<script setup lang="ts">
defineProps<{
    loading: boolean
    error: string | null
}>();

const emit = defineEmits(['retry'])
</script>

<template>
    <div class="card text-center">
        <div class="card-body" v-if="loading">
            Loading rockets, please wait…
        </div>

        <div class="card-body" v-else-if="error">
            <p class="text-danger">{{ error }}</p>
            <button class="btn btn-primary" @click="$emit('retry')">Retry</button>
        </div>
    </div>
</template>