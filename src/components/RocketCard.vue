<template>
  <RouterLink
    :to="{ name: 'rocket-detail', params: { id: rocket.id } }"
    class="rocket-card"
    :aria-label="`View details for ${rocket.name}`"
  >
    <div class="rocket-card__image-wrap">
      <img
        :src="imageSrc"
        :alt="rocket.name"
        class="rocket-card__image"
        loading="lazy"
        @error="onImageError"
      />
      <span v-if="rocket.isLocal" class="rocket-card__badge">Local</span>
    </div>

    <div class="rocket-card__body">
      <h2 class="rocket-card__name">
        {{ rocket.name }}
      </h2>
      <p class="rocket-card__description">
        {{ description }}
      </p>
      <p v-if="rocket.country" class="rocket-card__country">
        {{ rocket.country }}
      </p>
    </div>
  </RouterLink>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { formatDescription } from '@/utils/formatters'
import placeholderSrc from '@/assets/rocket-placeholder.svg'

const props = defineProps<{ rocket: Rocket }>()

const imageError = ref(false)

const imageSrc = computed(() =>
  !imageError.value && props.rocket.imageUrl ? props.rocket.imageUrl : placeholderSrc,
)

const description = computed(() => formatDescription(props.rocket.description))

function onImageError() {
  imageError.value = true
}
</script>

<style scoped>
.rocket-card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s;
}

.rocket-card:hover {
  border-color: var(--primary);
}

.rocket-card:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.rocket-card__image-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--bg);
}

.rocket-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rocket-card__badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--primary);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.rocket-card__body {
  padding: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.rocket-card__name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
  line-height: 1.3;
}

.rocket-card__description {
  font-size: 0.825rem;
  color: var(--text-muted);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.rocket-card__country {
  font-size: 0.75rem;
  color: var(--text-subtle);
  margin: auto 0 0;
  padding-top: 0.35rem;
}
</style>
