<template>
  <div>
    <!-- List Skeleton View (Matches RocketCard layout exactly) -->
    <v-row v-if="type === 'list'">
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        sm="6"
        lg="4"
        class="d-flex"
      >
        <div class="skeleton-rocket-card w-100 rounded-xl bg-white d-flex flex-column overflow-hidden">
          <!-- Image skeleton -->
          <div class="shimmer-box image-skeleton" />

          <!-- Card Body Skeleton -->
          <div class="pa-5 d-flex flex-column flex-grow-1">
            <div class="shimmer-box title-skeleton mb-2" />
            <div class="shimmer-box subtitle-skeleton mb-4" />

            <div class="shimmer-box desc-skeleton-1 mb-2" />
            <div class="shimmer-box desc-skeleton-2 mb-4" />

            <div class="mt-auto pt-3 border-t-subtle d-flex justify-space-between align-center">
              <div class="shimmer-box stat-skeleton" />
              <div class="shimmer-box stat-skeleton" />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Detail Skeleton View (Matches 2-Column Split Layout exactly) -->
    <div v-else>
      <v-row class="ga-0">
        <!-- Left Column Media & Profile Skeleton -->
        <v-col cols="12" md="5" class="pr-md-4 mb-6 mb-md-0">
          <div class="rounded-2xl bg-white overflow-hidden skeleton-border mb-4">
            <div class="shimmer-box detail-image-skeleton" />
            <div class="pa-4 bg-slate-50 border-t-subtle d-flex flex-column ga-3">
              <div class="d-flex justify-space-between">
                <div class="shimmer-box w-30 h-14" />
                <div class="shimmer-box w-25 h-14" />
              </div>
              <div class="d-flex justify-space-between">
                <div class="shimmer-box w-30 h-14" />
                <div class="shimmer-box w-35 h-14" />
              </div>
              <div class="d-flex justify-space-between">
                <div class="shimmer-box w-30 h-14" />
                <div class="shimmer-box w-20 h-14" />
              </div>
            </div>
          </div>

          <div class="rounded-xl bg-white pa-4 skeleton-border">
            <div class="d-flex align-center mb-3">
              <div class="shimmer-box avatar-skeleton mr-3" />
              <div class="flex-grow-1">
                <div class="shimmer-box w-50 h-16 mb-1" />
                <div class="shimmer-box w-35 h-12" />
              </div>
            </div>
            <div class="shimmer-box w-100 h-28" />
          </div>
        </v-col>

        <!-- Right Column Specs Skeleton -->
        <v-col cols="12" md="7" class="pl-md-4">
          <!-- Title & Badges Skeleton -->
          <div class="mb-6">
            <div class="d-flex ga-2 mb-3">
              <div class="shimmer-box tag-skeleton" />
              <div class="shimmer-box tag-skeleton" />
            </div>
            <div class="shimmer-box detail-title-skeleton mb-3" />
            <div class="shimmer-box w-100 h-16 mb-2" />
            <div class="shimmer-box w-75 h-16" />
          </div>

          <!-- Reliability Box Skeleton -->
          <div class="rounded-2xl bg-white pa-5 skeleton-border mb-6">
            <div class="d-flex justify-space-between align-center mb-3">
              <div class="shimmer-box w-40 h-18" />
              <div class="shimmer-box w-15 h-22" />
            </div>
            <div class="shimmer-box w-100 h-8 rounded-pill mb-3" />
            <div class="d-flex justify-space-between">
              <div class="shimmer-box w-30 h-12" />
              <div class="shimmer-box w-30 h-12" />
            </div>
          </div>

          <!-- Spec Category Cards Skeleton -->
          <div class="d-flex flex-column ga-4">
            <div v-for="i in 3" :key="i" class="rounded-2xl bg-white pa-5 skeleton-border">
              <div class="shimmer-box w-35 h-14 mb-4" />
              <v-row dense>
                <v-col cols="4"><div class="shimmer-box w-85 h-36 rounded-lg" /></v-col>
                <v-col cols="4"><div class="shimmer-box w-85 h-36 rounded-lg" /></v-col>
                <v-col cols="4"><div class="shimmer-box w-85 h-36 rounded-lg" /></v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'list' | 'detail'
  }>(),
  {
    type: 'list',
  }
)
</script>

<style scoped>
/* Shimmer base & animation */
.shimmer-box {
  background: linear-gradient(
    90deg,
    #f1f5f9 0%,
    #e2e8f0 50%,
    #f1f5f9 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
  border-radius: 6px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-rocket-card {
  border: 1px solid #e2e8f0;
}

.skeleton-border {
  border: 1px solid #e2e8f0;
}

.border-t-subtle {
  border-top: 1px solid #f1f5f9;
}

/* List element dimensions */
.image-skeleton {
  height: 200px;
  width: 100%;
  border-radius: 0;
}

.title-skeleton {
  height: 20px;
  width: 75%;
}

.subtitle-skeleton {
  height: 14px;
  width: 45%;
}

.desc-skeleton-1 {
  height: 14px;
  width: 100%;
}

.desc-skeleton-2 {
  height: 14px;
  width: 85%;
}

.stat-skeleton {
  height: 28px;
  width: 70px;
}

/* Detail element dimensions */
.detail-image-skeleton {
  height: 340px;
  width: 100%;
  border-radius: 0;
}

.avatar-skeleton {
  width: 36px;
  height: 36px;
  border-radius: 10px;
}

.tag-skeleton {
  width: 65px;
  height: 20px;
  border-radius: 6px;
}

.detail-title-skeleton {
  height: 36px;
  width: 65%;
}

/* Utility width & height helpers */
.w-15 { width: 15%; }
.w-20 { width: 20%; }
.w-25 { width: 25%; }
.w-30 { width: 30%; }
.w-35 { width: 35%; }
.w-40 { width: 40%; }
.w-50 { width: 50%; }
.w-75 { width: 75%; }
.w-80 { width: 80%; }
.w-85 { width: 85%; }
.w-100 { width: 100%; }

.h-8 { height: 8px; }
.h-12 { height: 12px; }
.h-14 { height: 14px; }
.h-16 { height: 16px; }
.h-18 { height: 18px; }
.h-22 { height: 22px; }
.h-28 { height: 28px; }
.h-36 { height: 36px; }
</style>
