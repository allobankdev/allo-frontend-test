<template>
  <v-card
    class="rocket-card"
    rounded="xl"
    elevation="0"
    tabindex="0"
    role="article"
    :aria-label="`Rocket ${rocket.full_name || 'Vehicle'}`"
    @click="navigateToDetail"
    @keydown.enter.prevent="navigateToDetail"
    @keydown.space.prevent="navigateToDetail"
  >
    <!-- Card Image Container -->
    <div class="rocket-card__image-wrapper">
      <v-img
        :src="rocket.image_url || undefined"
        :alt="rocket.full_name"
        aspect-ratio="16/9"
        cover
        class="rocket-card__image"
      >
        <template #placeholder>
          <div class="rocket-card__fallback">
            <v-progress-circular
              indeterminate
              size="24"
              width="2"
              color="primary"
            />
          </div>
        </template>
        <template #error>
          <div class="rocket-card__fallback">
            <v-icon
              icon="mdi-rocket-launch-outline"
              size="52"
              color="blue-grey-lighten-2"
            />
          </div>
        </template>
      </v-img>

      <!-- Badge for Country or Custom Rocket -->
      <div class="rocket-card__badge-wrapper">
        <span
          v-if="isCustom"
          class="badge badge--custom"
        >
          Custom
        </span>
        <span class="badge badge--country">
          {{ formattedCountry }}
        </span>
      </div>
    </div>

    <!-- Card Content -->
    <div class="rocket-card__content">
      <h3
        class="rocket-card__title"
        :title="rocket.full_name"
      >
        {{ rocket.full_name || 'Unnamed Rocket' }}
      </h3>
      <p
        class="rocket-card__desc"
        :title="formattedDescription"
      >
        {{ formattedDescription }}
      </p>
    </div>

    <!-- Card Footer -->
    <div class="rocket-card__footer">
      <span class="manufacturer-name">
        {{ rocket.manufacturer?.name || 'SpaceX' }}
      </span>

      <span class="view-specs">
        View Specs
        <v-icon
          icon="mdi-arrow-right"
          size="16"
          class="arrow-icon"
        />
      </span>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'
import { formatCountry, formatText } from '@/utils/formatters'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

const isCustom = computed(() => props.rocket.id < 0)

const formattedCountry = computed(() => {
  return formatCountry(props.rocket.manufacturer?.country_code, 'N/A')
})

const formattedDescription = computed(() => {
  return formatText(props.rocket.description, 'No description available for this launch vehicle.')
})

function navigateToDetail() {
  router.push(`/rockets/${props.rocket.id}`)
}
</script>

<style scoped>
.rocket-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #ffffff !important;
  border: 1px solid #e2e8f0;
  border-radius: 16px !important;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04) !important;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.2s ease;
  outline: none;
}

.rocket-card:focus-visible {
  border-color: #0b2545;
  box-shadow: 0 0 0 3px rgba(11, 37, 69, 0.2) !important;
}

.rocket-card:hover {
  transform: translateY(-4px);
  border-color: #cbd5e1;
  box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.08) !important;
}

.rocket-card__image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  background: #f1f5f9;
  overflow: hidden;
  flex-shrink: 0;
}

.rocket-card__image {
  width: 100%;
  height: 100%;
}

.rocket-card__fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.rocket-card__badge-wrapper {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
}

.badge {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.badge--country {
  background: rgba(15, 23, 42, 0.8);
  color: #ffffff;
  backdrop-filter: blur(4px);
}

.badge--custom {
  background: #3b82f6;
  color: #ffffff;
}

.rocket-card__content {
  display: flex;
  flex-direction: column;
  padding: 18px 20px 12px 20px;
  flex-grow: 1;
}

.rocket-card__title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
  margin: 0 0 8px 0;
  letter-spacing: -0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.7em;
}

.rocket-card__desc {
  font-size: 0.875rem;
  line-height: 1.55;
  color: #475569;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

/* Footer Section */
.rocket-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid #f1f5f9;
  background: #ffffff;
  margin-top: auto;
  flex-shrink: 0;
}

.manufacturer-name {
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.view-specs {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #0b2545;
  font-size: 13px;
  font-weight: 600;
  transition: color 0.15s ease;
}

.rocket-card:hover .view-specs {
  color: #1d4ed8;
}

.arrow-icon {
  transition: transform 0.2s ease;
}

.rocket-card:hover .arrow-icon {
  transform: translateX(4px);
}
</style>
