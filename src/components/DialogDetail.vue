<script setup lang="ts">
import {formatCurrency} from "@/utils/currency";

defineProps<{
  item: any;
}>();
defineEmits(["close"]);
</script>

<template>
  <v-dialog v-model="dialogDetail" persistent max-width="600">
    <v-card class="dialog-card">
      <v-carousel
        class="dialog-carousel"
        hide-delimiters
        show-arrows="hover"
      >
        <v-carousel-item
          v-for="(img,i) in item.flickr_images"
          :key="i"
          :src="img"
          cover
        ></v-carousel-item>
      </v-carousel>

      <v-card-title class="dialog-title" v-if="item">
        {{ item.name }}
      </v-card-title>

      <v-card-text v-if="item" class="dialog-content">
        <p class="dialog-description">{{ item.description }}</p>
        <div class="dialog-details">
          <v-icon icon="mdi-currency-usd" /> Biaya Peluncuran:
          <strong>{{ formatCurrency(item.cost_per_launch) }}</strong>
        </div>
        <div class="dialog-details">
          <v-icon icon="mdi-flag" /> Negara: <strong>{{ item.country }}</strong>
        </div>
        <div class="dialog-details">
          <v-icon icon="mdi-calendar" /> Penerbangan Pertama:
          <strong>{{ item.first_flight }}</strong>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated"  @click="$emit('close')">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.v-carousel-item img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.dialog-title {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  color: #4caf50;
  margin-top: 10px;
}

.dialog-content {
  font-size: 16px;
  color: #bbbbbb;
  line-height: 1.5;
  margin-bottom: 10px;
}

.dialog-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #bbbbbb;
  padding: 5px 0;
}

.v-btn {
  font-weight: bold;
  border-radius: 12px;
  transition: 0.3s ease;
}

.v-btn:hover {
  transform: scale(1.05);
}
</style>
