<script setup lang="ts">
import type { IRocket } from '@/types/rocket'
defineProps<{ rocket: IRocket }>()
</script>

<template>
  <v-row class="mt-6">
    <v-col cols="12" md="3">
      <v-card><v-card-text>
        <strong>Height</strong>
        <div>{{ rocket.height.meters }} m</div>
      </v-card-text></v-card>
    </v-col>

    <v-col cols="12" md="3">
      <v-card><v-card-text>
        <strong>Mass</strong>
        <div>{{ rocket.mass.kg.toLocaleString() }} kg</div>
      </v-card-text></v-card>
    </v-col>

    <v-col cols="12" md="3">
      <v-card><v-card-text>
        <strong>Engines</strong>
        <div>{{ rocket.engines.number }} × {{ rocket.engines.type }}</div>
      </v-card-text></v-card>
    </v-col>

    <v-col cols="12" md="3">
      <v-card><v-card-text>
        <strong>Success Rate</strong>
        <div>{{ rocket.success_rate_pct }}%</div>
      </v-card-text></v-card>
    </v-col>
  </v-row>
</template>
