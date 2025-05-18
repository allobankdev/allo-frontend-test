<template>
  <v-dialog v-model="dialog" max-width="800" scrollable>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="Explore" color="orange-lighten-2" />
    </template>

    <v-card :title="props.rocket.name" class="overflow-y-auto">
      <v-card-text>
        <!-- Carousel -->
        <v-carousel v-if="props.rocket?.flickr_images?.length">
          <v-carousel-item
            v-for="(item, index) in props.rocket.flickr_images"
            :key="index"
            :src="item"
            cover
          />
        </v-carousel>
        <v-row dense>
          <v-col cols="12">
            <h3 class="text-h6 mb-2">🌍 General Info</h3>
            <div><strong>Name:</strong> {{ props.rocket.name }}</div>
            <div><strong>Country:</strong> {{ props.rocket.country }}</div>
            <div><strong>Company:</strong> {{ props.rocket.company }}</div>
            <div><strong>First Flight:</strong> {{ props.rocket.first_flight }}</div>
            <div><strong>Cost/Launch:</strong> ${{ props.rocket.cost_per_launch.toLocaleString() }}</div>
          </v-col>

          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-2">📏 Dimensions</h3>
            <div><strong>Height:</strong> {{ props.rocket.height.meters }} m / {{ props.rocket.height.feet }} ft</div>
            <div><strong>Diameter:</strong> {{ props.rocket.diameter.meters }} m / {{ props.rocket.diameter.feet }} ft</div>
            <div><strong>Mass:</strong> {{ props.rocket.mass.kg }} kg / {{ props.rocket.mass.lb }} lb</div>
          </v-col>

          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-2">🚀 First Stage</h3>
            <div><strong>Engines:</strong> {{ props.rocket.first_stage.engines }}</div>
            <div><strong>Thrust (Sea Level):</strong> {{ props.rocket.first_stage.thrust_sea_level.kN }} kN</div>
            <div><strong>Fuel:</strong> {{ props.rocket.first_stage.fuel_amount_tons }} tons</div>
            <div><strong>Burn Time:</strong> {{ props.rocket.first_stage.burn_time_sec }} sec</div>
          </v-col>

          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-2">🛰️ Second Stage</h3>
            <div><strong>Engines:</strong> {{ props.rocket.second_stage.engines }}</div>
            <div><strong>Thrust:</strong> {{ props.rocket.second_stage.thrust.kN }} kN</div>
            <div><strong>Fuel:</strong> {{ props.rocket.second_stage.fuel_amount_tons }} tons</div>
            <div><strong>Burn Time:</strong> {{ props.rocket.second_stage.burn_time_sec }} sec</div>
          </v-col>

          <v-col cols="12">
            <h3 class="text-h6 mb-2">⚙️ Engine</h3>
            <div><strong>Type:</strong> {{ props.rocket.engines.type }}</div>
            <div><strong>Version:</strong> {{ props.rocket.engines.version }}</div>
            <div><strong>Layout:</strong> {{ props.rocket.engines.layout }}</div>
            <div><strong>ISP (Vacuum):</strong> {{ props.rocket.engines.isp.vacuum }}</div>
            <div><strong>Thrust-to-Weight:</strong> {{ props.rocket.engines.thrust_to_weight }}</div>
          </v-col>

          <v-col cols="12">
            <h3 class="text-h6 mb-2">📦 Payload</h3>
            <div
              v-for="(payload, index) in props.rocket.payload_weights"
              :key="index"
            >
              <strong>{{ payload.name }}:</strong> {{ payload.kg }} kg / {{ payload.lb }} lb
            </div>
          </v-col>

          <v-col cols="12">
            <h3 class="text-h6 mb-2">📚 Description</h3>
            <div>{{ props.rocket.description }}</div>
          </v-col>

          <v-col cols="12">
            <v-btn :href="props.rocket.wikipedia" target="_blank" color="blue" variant="text">
              🔗 Wikipedia
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Close" color="primary" @click="dialog = false" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref} from 'vue';

const dialog = ref(false);

const props = defineProps<{rocket?: object}>();

</script>
