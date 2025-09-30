<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useRocketsStore, type Rocket } from "@/composables/useRocketsStore";

const route = useRoute();
const store = useRocketsStore();

const rocket = ref<Rocket | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const priceCompact = computed(() => {
  const n = Number(rocket.value?.cost_per_launch || 0);
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(n)
    .replace("G", "B");
});

const priceFull = computed(() =>
  Number(rocket.value?.cost_per_launch || 0).toLocaleString("en-US")
);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    rocket.value = await store.ensureById(String(route.params.id));
  } catch (e: any) {
    error.value = e?.message ?? "Unknown error";
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <v-container class="detail py-6">
    <div class="topbar">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/">Back</v-btn>
      <v-spacer />
    </div>

    <div v-if="loading" class="stack">
      <v-skeleton-loader
        type="image, article, table"
        class="w-100 rounded-xl"
      />
    </div>

    <div v-else-if="error" class="stack">
      <v-alert
        type="error"
        variant="tonal"
        border="start"
        rounded="lg"
        class="mb-3"
        title="Failed to load"
        :text="error"
      />
      <v-btn color="error" prepend-icon="mdi-reload" @click="load">Retry</v-btn>
    </div>

    <template v-else-if="rocket">
      <v-card class="hero" elevation="4">
        <v-img
          :src="rocket.images?.[0]"
          :alt="rocket.name"
          aspect-ratio="16/9"
          cover
        >
          <template #placeholder>
            <div class="hero-ph">
              <v-skeleton-loader type="image" width="100%" height="100%" />
            </div>
          </template>
          <template #error>
            <div class="hero-ph">
              <v-icon size="36">mdi-image-off-outline</v-icon>
            </div>
          </template>

          <div class="img-overlay" />
        </v-img>

        <v-card-item>
          <v-card-title class="title">{{ rocket.name }}</v-card-title>
          <v-card-subtitle class="subtitle">
            <v-icon size="18" class="mr-1">mdi-currency-usd</v-icon>
            ${{ priceCompact }} <span class="muted">/ launch</span>
          </v-card-subtitle>
        </v-card-item>

        <v-card-text class="desc">
          {{ rocket.description }}
        </v-card-text>
      </v-card>

      <v-card class="specs" elevation="2">
        <v-table density="comfortable">
          <tbody>
            <tr>
              <td>Cost per launch</td>
              <td>${{ priceFull }}</td>
            </tr>
            <tr>
              <td>Country</td>
              <td>{{ rocket.country }}</td>
            </tr>
            <tr>
              <td>First flight</td>
              <td>{{ rocket.first_flight }}</td>
            </tr>
            <tr>
              <td>Company</td>
              <td>{{ rocket.company }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <div v-if="rocket.images?.length > 1" class="gallery">
        <v-img
          v-for="(img, i) in rocket.images.slice(1, 5)"
          :key="i"
          :src="img"
          height="120"
          cover
          class="thumb"
        >
          <template #error>
            <div class="thumb-ph">
              <v-icon size="20">mdi-image-off-outline</v-icon>
            </div>
          </template>
        </v-img>
      </div>
    </template>

    <div v-else class="stack">
      <v-alert
        type="warning"
        title="Not found"
        text="Rocket not found."
        variant="tonal"
      />
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.detail {
  max-width: 980px;
}

.topbar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  margin: 48px 0;
}

.hero {
  overflow: hidden;
  border-radius: 16px;
  margin-bottom: 16px;

  .hero-ph {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: rgba(0, 0, 0, 0.06);
  }

  .badge-r {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.45),
      rgba(0, 0, 0, 0.15) 40%,
      transparent 65%
    );
  }

  .title {
    font-weight: 800;
    letter-spacing: 0.2px;
  }
  .subtitle .muted {
    opacity: 0.72;
  }
  .desc {
    opacity: 0.86;
  }
}

.specs {
  border-radius: 14px;
  margin-top: 8px;
  :deep(td) {
    padding: 10px 14px;
  }
  :deep(td:first-child) {
    width: 200px;
    opacity: 0.75;
  }
}

.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 16px;
  .thumb {
    border-radius: 12px;
    overflow: hidden;
  }
  .thumb-ph {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: rgba(0, 0, 0, 0.06);
  }
}

@media (max-width: 700px) {
  .gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
