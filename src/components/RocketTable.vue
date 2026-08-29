<script setup lang="ts">
import type { IRocket } from '@/types/rocket'
defineProps<{ payloads: IRocket['payload_weights'] }>()
</script>

<template>
  <v-row class="mt-8">
    <v-col cols="12">
      <h2 class="text-h5 mb-4">Payload Capacities</h2>

      <v-table>
        <thead>
          <tr>
            <th>Orbit</th>
            <th>Capacity (kg)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!payloads || payloads.length === 0">
            <td colspan="2" class="text-center text-grey">No data available</td>
          </tr>
          <tr v-else v-for="p in payloads" :key="p.id">
            <td>{{ p.name || '-' }}</td>
            <td>{{ p.kg?.toLocaleString?.() ?? '-' }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>
