<template>
  <Layout>
    <v-container>
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <v-text-field
            v-model="search"
            placeholder="Search rocket..."
            density="compact"
            hide-details
            variant="solo-filled"
            style="width: 250px"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="blue-accent-2"
            variant="flat"
            class="mr-2"
            @click="$router.push('/rocket/add')"
          >
            Add
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-infinite-scroll @load="load" :key="search">
        <v-container>
          <v-row dense v-if="!loading">
            <v-col
              v-for="n in data"
              :key="n.id"
              cols="12"
              v-on:click="gotoDetail(n.id)"
            >
              <v-card elevation="3" class="hover-scale" hover>
                <v-row no-gutters>
                  <v-col cols="12" sm="1">
                    <v-img
                      v-if="n.flickr_images.length > 0"
                      :src="n.flickr_images[0]"
                      height="120px"
                      width="120px"
                      cover
                    />
                    <v-img
                      v-else
                      :src="logo"
                      height="120px"
                      width="120px"
                      cover
                    />
                  </v-col>
                  <v-col cols="12" sm="11">
                    <v-card-item>
                      <v-card-title>{{ n.name }}</v-card-title>
                      <v-card-text class="mt-1 pa-0">
                        {{ n.description }}
                      </v-card-text>
                    </v-card-item>
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
      </v-infinite-scroll>
    </v-container>
  </Layout>
</template>

<script>
import { storeToRefs } from "pinia";
import logo from "../../assets/logo.png";
import Layout from "../../components/rocket/Layout.vue";
import { useRocketStore } from "@/stores/rocket";
import { onMounted, ref, watch } from "vue";
import router from "@/router";
import Skeleton from "@/components/rocket/Skeleton.vue";
export default {
  components: { Layout, Skeleton },
  setup() {
    const rocketStore = useRocketStore();
    const { data, loading } = storeToRefs(rocketStore);
    const search = ref("");

    const gotoDetail = (id) => {
      router.replace(`/rocket/${id}`);
    };

    const load = ({ done }) => {
      const hasMore = rocketStore.loadMore();
      done(hasMore ? "ok" : "empty");
    };

    watch(search, (val) => {
      rocketStore.applySearch(val);
    });

    onMounted(async () => {
      await rocketStore.getRocket();
    });

    return {
      logo,
      data,
      loading,
      gotoDetail,
      load,
      search,
    };
  },
};
</script>

<style></style>
