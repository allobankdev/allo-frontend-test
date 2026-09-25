<template>
  <v-container
    class="py-8"
    max-width="800"
  >
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6 px-0 text-grey-lighten-1"
      :ripple="false"
      @click="router.back()"
    >
      Kembali
    </v-btn>

    <v-row
      v-if="isPending"
      justify="center"
      class="mt-12"
    >
      <v-col class="text-center">
        <v-progress-circular
          indeterminate
          color="white"
          size="64"
        />
      </v-col>
    </v-row>

    <v-row
      v-else-if="isError"
      justify="center"
      class="mt-12"
    >
      <v-col class="text-center">
        <v-icon
          color="error"
          size="64"
          class="mb-4"
        >
          mdi-alert-circle
        </v-icon>
        <h3 class="text-h6 mb-4 text-white">
          Roket tidak ditemukan
        </h3>
        <v-btn
          color="error"
          variant="flat"
          @click="refetch"
        >
          Coba Lagi
        </v-btn>
      </v-col>
    </v-row>

    <v-card
      v-else-if="rocket"
      color="#1E1F0A"
      variant="flat"
      rounded="0"
    >
      <v-img
        :src="rocket.image_url || 'https://via.placeholder.com/800x400?text=No+Image'"
        height="450"
        cover
        class="bg-grey-darken-4"
      />

      <v-card-text class="px-0 pt-8 pb-12">
        <h1 class="text-h3 font-weight-bold mb-4 text-white">
          {{ rocket.full_name }}
        </h1>

        <p
          class="text-body-1 mb-10 text-grey-lighten-1"
          style="line-height: 1.8;"
        >
          {{ rocket.description || 'Tidak ada deskripsi yang tersedia untuk roket ini.' }}
        </p>

        <v-divider
          color="grey-darken-2"
          class="mb-8"
          opacity="0.5"
        />

        <v-row>
          <v-col
            cols="12"
            sm="4"
          >
            <div class="text-caption text-grey text-uppercase font-weight-bold mb-2">
              Biaya Peluncuran
            </div>
            <div class="text-h6 font-weight-regular text-white">
              {{ rocket.launch_cost ? `$${rocket.launch_cost}` : 'Tidak diketahui' }}
            </div>
          </v-col>

          <v-col
            cols="12"
            sm="4"
          >
            <div class="text-caption text-grey text-uppercase font-weight-bold mb-2">
              Terbang Perdana
            </div>
            <div class="text-h6 font-weight-regular text-white">
              {{ rocket.maiden_flight || 'Tidak diketahui' }}
            </div>
          </v-col>

          <v-col
            cols="12"
            sm="4"
          >
            <div class="text-caption text-grey text-uppercase font-weight-bold mb-2">
              Negara Pembuat
            </div>
            <div class="text-h6 font-weight-regular text-white">
              {{ rocket.manufacturer?.country_code || 'Tidak diketahui' }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { useRocketStore } from '../stores/rocketStore';
import { rocketApi } from '../api/rocketApi';

const route = useRoute();
const router = useRouter();
const rocketStore = useRocketStore();

const rocketId = route.params.id as string;

const localRocket = computed(() => {
  return rocketStore.localRockets.find(r => r.id.toString() === rocketId);
});

const { data: apiRocket, isLoading, isError, refetch } = useQuery({
  queryKey: ['rocket', rocketId],
  queryFn: () => rocketApi.getRocketDetail(rocketId),
  enabled: !localRocket.value,
  retry: 1
});

const rocket = computed(() => localRocket.value || apiRocket.value);

const isPending = computed(() => !localRocket.value && isLoading.value);
</script>
