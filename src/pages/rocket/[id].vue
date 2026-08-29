<template>
  <Layout>
    <v-container>
      <v-breadcrumbs :items="items" class="px-0">
        <template v-slot:prepend>
          <v-icon icon="$vuetify" size="small"></v-icon>
        </template>
      </v-breadcrumbs>
      <v-row dense v-if="!loading">
        <v-col cols="12">
          <v-card v-if="dataDetail" elevation="3" class="pa-4">
            <v-row align="center">
              <v-col cols="12" sm="2" class="d-flex justify-center">
                <v-img
                  v-if="dataDetail.flickr_images.length > 0"
                  :src="dataDetail.flickr_images[0]"
                  height="200px"
                  width="200px"
                  cover
                />
                <v-img v-else :src="logo" height="200px" width="200px" cover />
              </v-col>

              <v-col cols="12" sm="10">
                <v-row align="center">
                  <v-col>
                    <div class="text-h6 font-weight-bold">
                      {{ dataDetail.name }}
                    </div>
                    <div class="text-caption my-3">
                      <span class="font-italic">First Flight : </span
                      ><span
                        class="bg-primary text-white px-2 py-1 rounded-xl"
                        >{{ dataDetail.first_flight }}</span
                      >
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      {{ dataDetail.description }}
                    </div>
                  </v-col>
                </v-row>

                <v-row class="mt-2">
                  <v-col>
                    <div class="text-caption">
                      {{
                        dataDetail.cost_per_launch
                          ? customCurrency(dataDetail.cost_per_launch)
                          : "-"
                      }}
                    </div>
                  </v-col>

                  <v-col cols="auto">
                    <div class="text-caption font-italic">
                      {{ dataDetail.country }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense v-else>
        <v-col cols="12">
          <Skeleton />
        </v-col>
      </v-row>
    </v-container>
  </Layout>
</template>

<script>
import { useRoute } from "vue-router";
import logo from "../../assets/logo.png";
import Layout from "@/components/rocket/Layout.vue";
import { useRocketStore } from "@/stores/rocket";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { customCurrency } from "@/helpers";
import Skeleton from "@/components/rocket/Skeleton.vue";

export default {
  components: { Layout, Skeleton },
  setup() {
    const router = useRoute();
    const rocketStore = useRocketStore();

    const { dataDetail, loading } = storeToRefs(rocketStore);
    const id = router.params.id;
    const items = [
      {
        title: "Rocket",
        disabled: false,
        to: "/rocket",
      },
      {
        title: "Detail",
        disabled: false,
        to: `/rocket/${id}`,
      },
    ];

    onMounted(() => {
      rocketStore.getRocketById(id);
    });

    return {
      logo,
      items,
      dataDetail,
      customCurrency,
      loading,
    };
  },
};
</script>

<style></style>
