<template>
  <RouterLink class="rocket-card" :to="`/rockets/${rocket.id}`" :aria-label="`View ${rocket.full_name || 'rocket'} details`">
    <div class="rocket-card__image">
      <img v-if="rocket.image_url && !imageFailed" :src="rocket.image_url" :alt="rocket.full_name || 'Rocket'" loading="lazy" @error="imageFailed = true">
      <img v-else class="fallback-image" src="/rocket-placeholder.svg" alt="Illustrated rocket placeholder; photo unavailable">
      <span class="image-index">{{ indexLabel }}</span>
    </div>
    <div class="rocket-card__content">
      <div class="card-title-row"><h2>{{ rocket.full_name || 'Unnamed rocket' }}</h2><v-icon icon="mdi-arrow-top-right" size="18" /></div>
      <p>{{ rocket.description || 'No description is available for this rocket yet.' }}</p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Rocket } from '@/types/rocket'
defineProps<{ rocket: Rocket; indexLabel: string }>()
const imageFailed = ref(false)
</script>

<style scoped>
.rocket-card{display:flex;flex-direction:column;overflow:hidden;border:1px solid #deded8;border-radius:8px;background:#fff;color:inherit;text-decoration:none;transition:transform .2s,border-color .2s}.rocket-card:hover{transform:translateY(-3px);border-color:#a6a69e}.rocket-card__image{height:218px;position:relative;background:#eeeee9;overflow:hidden}.rocket-card__image img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s}.rocket-card__image img.fallback-image{object-fit:cover}.rocket-card:hover img{transform:scale(1.035)}.image-index{position:absolute;left:14px;top:14px;background:#ffffffdb;border-radius:3px;padding:5px 8px;font-size:10px;letter-spacing:.12em}.rocket-card__content{padding:19px 20px 22px}.card-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.card-title-row h2{font-size:18px;line-height:1.3;font-weight:600;letter-spacing:-.025em}.card-title-row :deep(.v-icon){color:#89897f}.rocket-card__content p{margin-top:11px;color:#686860;font-size:13px;line-height:1.7;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
</style>
