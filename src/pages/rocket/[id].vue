<template>
  <v-container class="py-8">
    <!-- Back -->
    <v-btn variant="text" class="mb-4" @click="router.back()">
      ← Kembali
    </v-btn>

    <!-- Loading -->
    <div v-if="store.loading && !store.error" class="state">
      <RocketLoading text="Loading Detail" />
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="state">
      <div class="error-box">
        <p class="mb-4">⚠️ {{ store.error }}</p>
        <v-btn color="primary" @click="store.getRocketById(id)"> Retry </v-btn>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!store.loading && !rocket" class="state">
      <p class="empty-text">No rocket detail found 🚀</p>
    </div>

    <!-- DETAIL -->
    <div v-else-if="rocket">
      <v-row>
        <!-- IMAGE CAROUSEL -->
        <v-col cols="12" md="6">
          <v-carousel
            height="350"
            show-arrows="hover"
            hide-delimiter-background
            cycle
            interval="4000"
            class="rounded-lg mb-4"
          >
            <v-carousel-item
              v-for="(img, i) in rocket.flickr_images"
              :key="i"
              :src="img"
              cover
            />
          </v-carousel>
        </v-col>

        <!-- INFO ROCKET -->
        <v-col cols="12" md="6">
          <h1 class="text-h4 font-weight-bold mb-2">
            {{ rocket.name }}
          </h1>

          <p class="text-grey mb-4">
            {{ rocket.country }}
          </p>

          <p class="mb-6">
            {{ rocket.description }}
          </p>

          <!-- INFO DETAIL -->
          <div class="info">
            <div class="info-item">
              <span>🚀 Biaya per Peluncuran</span>
              <strong> ${{ rocket.cost_per_launch.toLocaleString() }} </strong>
            </div>

            <div class="info-item">
              <span>📊 Tingkat Keberhasilan</span>
              <strong>{{ rocket.success_rate_pct }}%</strong>
            </div>

            <div class="info-item">
              <span>📅 Penerbangan Pertama</span>
              <strong>{{ rocket.first_flight }}</strong>
            </div>

            <div class="info-item">
              <span>📏 Tinggi</span>
              <strong>{{ rocket.height.meters }} m</strong>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted } from "vue";
import { useRocketStore } from "@/stores/rockets";

const route = useRoute();
const router = useRouter();
const store = useRocketStore();

const id = route.params.id as string;

const getRocketDetail = () => {
  if (!id) return;
  store.getRocketById(id);
};

onMounted(() => {
  getRocketDetail();
});

const rocket = computed(() => store.rocketDetail);
</script>

<style scoped lang="scss">
.state {
  text-align: center;
  padding: 80px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.empty-text {
  color: #888;
  font-size: 14px;
}

.error-box {
  color: #d32f2f;

  p {
    font-weight: 500;
  }
}

.info {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 14px;
    border: 1px solid #eee;
    border-radius: 10px;
    background: #fafafa;
  }
}

:deep(.v-carousel) {
  border-radius: 12px;
}
</style>
