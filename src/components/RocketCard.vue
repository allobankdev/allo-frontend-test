<template>
    <v-card>
        <v-img
            v-if="props.rocket.image_url && !imageError" 
            :src="props.rocket.image_url"
            height="200"
            cover
            @error="imageError = true"
        />
        <div v-else style="height: 200px; display: flex; align-items: center; justify-content: center; background: #eee;">
            No Image available
        </div>
        <v-card-title>{{ props.rocket.full_name }}</v-card-title>
        <v-card-text>{{ props.rocket.description ?? 'Description not available' }}</v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
    import type { Rocket } from '@/types/Rocket';
    import { ref } from 'vue';

    const props = defineProps<{rocket: Rocket}>();
    const imageError = ref(false);
</script>