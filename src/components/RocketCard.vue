<template>
  <v-card
    hover
    height="100%"
    @click="$router.push(`/rockets/${rocket.id}`)"
  >
    <div class="card-header">
      <div class="text-subtitle-1 font-weight-bold text-truncate">
        {{ rocket.fullName }}
      </div>
      <div class="text-caption text-medium-emphasis text-truncate">
        {{ rocket.name !== rocket.fullName ? rocket.name : ' ' }}
      </div>
    </div>

    <v-img
      v-if="rocket.imageUrl"
      :src="rocket.imageUrl"
      height="200"
      cover
    />
    <v-img
      v-else
      height="200"
      cover
      color="surface-variant"
    >
      <div class="d-flex align-center justify-center">
        <v-icon size="56" icon="mdi-rocket-outline" />
      </div>
    </v-img>

    <v-card-text>
      <div
        ref="descEl"
        class="card-description"
        :title="truncated ? rocket.description : undefined"
      >
        {{ displayText }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import type { Rocket } from '@/services/rocketService'

  const props = defineProps<{ rocket: Rocket }>()

  const LINE_CLAMP = 3
  const descEl = ref<HTMLElement | null>(null)
  const displayText = ref(props.rocket.description || 'No description available')
  const truncated = ref(false)
  let observer: ResizeObserver | null = null

  function updateClamp () {
    const el = descEl.value
    if (!el) return
    const text = props.rocket.description || 'No description available'
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
    const maxHeight = Number.isFinite(lineHeight) && lineHeight > 0 ? lineHeight * LINE_CLAMP : 60
    el.style.height = `${maxHeight}px`

    const fits = (candidate: string): boolean => {
      el.textContent = candidate
      return el.scrollHeight <= maxHeight + 0.5
    }

    if (fits(text)) {
      displayText.value = text
      truncated.value = false
      return
    }

    let lo = 0
    let hi = text.length
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2)
      if (fits(text.slice(0, mid) + '…')) {
        lo = mid
      } else {
        hi = mid - 1
      }
    }
    displayText.value = text.slice(0, lo) + '…'
    truncated.value = lo < text.length
  }

  onMounted(() => {
    observer = new ResizeObserver(updateClamp)
    if (descEl.value) {
      observer.observe(descEl.value)
    }
    updateClamp()
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })
</script>

<style scoped>
  .card-header {
    min-height: 64px;
    padding: 4px 16px;
  }
  .card-description {
    line-height: 1.4;
    overflow: hidden;
    overflow-wrap: break-word;
  }
</style>