<template>
  <v-container class="py-8" v-if="data">
    <NavUtils />
    <v-card elevation="4" class="pa-6 rounded-xl">
      <v-card-title class="text-h5 font-weight-bold">{{ data.name }}</v-card-title>
      <v-card-subtitle class="mb-4">
        Founded by {{ data.founder }} since {{ data.founded }}
      </v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-list dense>
              <v-list-item>
                <v-list-item-title><strong>CEO:</strong> {{ data.ceo }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>CTO:</strong> {{ data.cto }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>COO:</strong> {{ data.coo }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>CTO Propulsion:</strong> {{ data.cto_propulsion }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>Total Employee:</strong> {{ data.employees?.toLocaleString() }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>Valuation:</strong> ${{ (data.valuation / 1_000_000_000).toFixed(1) }} Billion</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>Vehicles:</strong> {{ data.vehicles }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>Launch Sites:</strong> {{ data.launch_sites }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>Test Sites:</strong> {{ data.test_sites }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="pa-4" color="blue-grey lighten-5" outlined>
              <strong>Headquarters Address:</strong>
              <div>{{ data.headquarters?.address }}, {{ data.headquarters?.city }}, {{ data.headquarters?.state }}</div>

              <div class="mt-4">
                <strong>Social Media Links:</strong>
                <v-list dense class="mt-2">
                  <v-list-item :href="data.links?.website" target="_blank">
                    <v-list-item-icon>
                      <v-icon>mdi-web</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Website</v-list-item-title>
                  </v-list-item>

                  <v-list-item :href="data.links?.flickr" target="_blank">
                    <v-list-item-icon>
                      <v-icon>mdi-image-multiple</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Flickr</v-list-item-title>
                  </v-list-item>

                  <v-list-item :href="data.links?.twitter" target="_blank">
                    <v-list-item-icon>
                      <v-icon>mdi-twitter</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Twitter</v-list-item-title>
                  </v-list-item>

                  <v-list-item :href="data.links?.elon_twitter" target="_blank">
                    <v-list-item-icon>
                      <v-icon>mdi-account-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Twitter Elon Musk</v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>

            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <div>
          <strong>About SpaceX:</strong>
          <p class="mt-2">{{ data.summary }}</p>
        </div>
      </v-card-text>
    </v-card>
  </v-container>

  <!-- Loading / fallback -->
  <v-container v-else class="py-8">
    <v-skeleton-loader type="card" />
  </v-container>
</template>

<script lang="ts" setup>
import {useInfoStore} from "@/store/InfoStore";
import {onMounted, computed} from "vue";
import NavUtils from "@/components/NavUtils.vue";

const infoStore = useInfoStore();

onMounted(() => {
  infoStore.fetchInfo();
})

const data = computed(() => infoStore.info);
</script>

<style scoped>
p {
  line-height: 1.6;
}
</style>
