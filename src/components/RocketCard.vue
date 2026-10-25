<template>
  <div
    class="rocket-card"
    :style="{ animationDelay: `${index * 60}ms` }"
    @click="$emit('click')"
  >
    <div class="rocket-card__media">
      <v-img
        :src="imageUrl ?? undefined"
        height="190"
        cover
      >
        <template #placeholder>
          <div class="rocket-card__fallback">
            <v-icon
              icon="mdi-rocket-launch-outline"
              size="40"
            />
            <span class="mono">NO SIGNAL</span>
          </div>
        </template>
        <template #error>
          <div class="rocket-card__fallback">
            <v-icon
              icon="mdi-image-off-outline"
              size="40"
            />
            <span class="mono">IMAGE UNAVAILABLE</span>
          </div>
        </template>
      </v-img>
      <span
        v-if="rocket.isLocal"
        class="rocket-card__tag mono"
      >CUSTOM ENTRY</span>
      <span class="rocket-card__index mono">{{
        String(index + 1).padStart(2, "0")
      }}</span>
    </div>

    <div class="rocket-card__body">
      <h3 class="display">
        {{ rocket.full_name || "UNKNOWN VEHICLE" }}
      </h3>
      <p>
        {{
          rocket.description || "No mission data available for this vehicle."
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Rocket } from "@/types/rocket";

const props = withDefaults(defineProps<{ rocket: Rocket; index?: number }>(), {
  index: 0,
});
defineEmits<{ click: [] }>();

const imageUrl = computed(() => props.rocket.image_url || null);
</script>

<style scoped>
.rocket-card {
  background: var(--bg-panel);
  border: 1px solid var(--line);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  animation: rise 0.5s ease backwards;
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
}
.rocket-card:hover {
  border-color: var(--amber);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px -12px var(--amber-dim);
}
.rocket-card__media {
  position: relative;
  border-bottom: 1px solid var(--line);
}
.rocket-card__fallback {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: repeating-linear-gradient(
    45deg,
    #1a1f28,
    #1a1f28 10px,
    #171b23 10px,
    #171b23 20px
  );
  color: var(--text-dim);
}
.rocket-card__fallback .mono {
  font-size: 11px;
  letter-spacing: 0.1em;
}
.rocket-card__index {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(10, 13, 18, 0.75);
  color: var(--amber);
  padding: 2px 8px;
  font-size: 12px;
  border: 1px solid var(--amber-dim);
}
.rocket-card__tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--secondary, #4fd1c5);
  color: #06231f;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.rocket-card__body {
  padding: 18px 20px 22px;
}
.rocket-card__body h3 {
  font-size: 17px;
  margin-bottom: 8px;
  text-transform: uppercase;
}
.rocket-card__body p {
  color: var(--text-dim);
  font-size: 13.5px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
