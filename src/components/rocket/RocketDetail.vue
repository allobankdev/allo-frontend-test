<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiChevronLeft } from "@mdi/js";
import type { RocketResults } from "@/types/rocket";
import { useRouter } from "vue-router";
import { formatCurrency, formatDate } from "@/utils/formatter";

interface Props {
  rocket: RocketResults | null;
}

defineProps<Props>();

const path = mdiChevronLeft;
const router = useRouter();
const back = () => {
  router.push("/");
};
</script>

<template>
  <div class="d-flex flex-row align-center ga-2">
    <button 
      class="d-flex align-center justify-center cursor-pointer"
      @click="back()" 
    >
      <SvgIcon 
        type="mdi" 
        :path="path" 
        size="50" 
      />
    </button>

    <h1 class="text-h4 font-weight-bold">
      Rocket Detail
    </h1>
  </div>
  <v-row 
    v-if="rocket" 
    class="mt-2"
  >
    <v-col 
      cols="12" 
      md="6"
    >
      <v-img
        :src="rocket.image_url || undefined"
        height="400"
        cover
        rounded="lg"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-icon
              icon="mdi-rocket-launch-outline"
              size="64"
              color="medium-emphasis"
            />
          </div>
        </template>
      </v-img>
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <div class="d-flex flex-column ga-4">
        <div class="d-flex flex-column ga-2">
          <table>
            <tbody>
              <tr>
                <td 
                  class="text-medium-emphasis"
                >
                  Name
                </td>
                <td 
                  class="pr-3" 
                >
                  :
                </td> 
                <td style="vertical-align: top;">
                  <p class="text-body-1 text-medium-emphasis text-justify">
                    {{ rocket.full_name || 'Rocket name unavailable' }}
                  </p>
                </td>
              </tr>
              <tr>
                <td 
                  style="vertical-align: top;"
                  class="text-medium-emphasis w-25"
                >
                  Description
                </td>
                <td 
                  class="pr-3" 
                  style="vertical-align: top;"
                >
                  :
                </td> 
                <td style="vertical-align: top;">
                  <p class="text-body-1 text-medium-emphasis text-justify">
                    {{ rocket.description || 'No description available.' }}
                  </p>
                </td>
              </tr>
              <tr>
                <td 
                  class="text-medium-emphasis"
                >
                  Cost Per Launch
                </td>
                <td 
                  class="pr-3" 
                >
                  :
                </td> 
                <td style="vertical-align: top;">
                  <p class="text-body-1 text-medium-emphasis text-justify">
                    {{ formatCurrency(rocket.launch_cost) }}
                  </p>
                </td>
              </tr>
              <tr>
                <td 
                  class="text-medium-emphasis"
                >
                  Country
                </td>
                <td 
                  class="pr-3" 
                >
                  :
                </td> 
                <td style="vertical-align: top;">
                  <p class="text-body-1 text-medium-emphasis text-justify">
                    {{ rocket.manufacturer?.country_code || 'Country unavailable' }}
                  </p>
                </td>
              </tr>
              <tr>
                <td 
                  class="text-medium-emphasis"
                >
                  First Flight
                </td>
                <td 
                  class="pr-3" 
                >
                  :
                </td> 
                <td style="vertical-align: top;">
                  <p class="text-body-1 text-medium-emphasis text-justify">
                    {{ formatDate(rocket.maiden_flight) || 'First flight date unavailable' }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </v-col>
  </v-row>
</template>
