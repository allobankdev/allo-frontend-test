<template>
  <v-card>
    <v-carousel height="500" :show-arrows="showArrow" cycle hide-delimiters>
      <v-carousel-item v-for="(img, i) in item?.images" :key="i">
        <v-img :src="img" height="500">
          <template #placeholder>
            <v-img height="500" cover src="/images/placeholder.png" />
          </template>

          <template #error>
            <v-img height="500" cover src="/images/placeholder.png" />
          </template>
        </v-img>
      </v-carousel-item>
    </v-carousel>

    <v-card-title>{{ item?.name }}</v-card-title>
    <v-card-text>
      <TextLabel label="Description" :value="item?.description" />
      <divider />
      <TextLabel label="Country" :value="item?.country" />
      <divider />
      <TextLabel label="cost per launch" :value="`$ ${formatNumber(item?.cost ?? 0)}`" />
      <divider />
      <TextLabel label="first flight" :value="formatDate(item?.firstFlight)" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type {Rocket} from '@/types/Rocket'
import {formatDate, formatNumber} from '@/utils/textUtil'
import Divider from './Divider.vue'
import {computed} from 'vue'

const {item} = defineProps<{item?: Rocket | null}>()

const showArrow = computed(() => !!item && item?.images?.length > 1)
</script>
