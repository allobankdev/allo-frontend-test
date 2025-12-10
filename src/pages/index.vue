<template>
  <v-container>
    <h1>Rocket List</h1>
    <FilterRocket />
    <FormRocket
      :isOpen="modalAddRocket"
      @closeModal="closeModalAddRocket"
      @handleSubmit="addRocket"
    />
    <v-row v-if="rocketStore.isLoading">
      <v-col v-for="n in 6" :key="n" cols="12" md="6">
        <v-skeleton-loader
          class="mx-auto border"
          max-width="300"
          type="image, article"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
    <template v-else-if="rocketStore.isError">
      <RetryButton
        :errorMessage="rocketStore.isError"
        @retry="rocketStore.getRockets"
      />
    </template>

    <div v-else>
      <div class="d-flex justify-end">
        <v-btn color="primary" @click="openModalAddRocket"> Add Rocket </v-btn>
      </div>
      <v-row no-gutters>
        <v-col
          v-for="rocket in rocketStore.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="4"
        >
          <CardRocket
            :title="rocket.name"
            :img="rocket.flickr_images[0]"
            :description="rocket.description"
            :isLoading="rocketStore.isLoading"
            @click="goToDetail(rocket.id)"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { useRocketStore } from "../store/rocket-store/useRocketStore";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { type Rocket } from "../features/rocket/types/rocket.dto";

const router = useRouter();
const rocketStore = useRocketStore();

const modalAddRocket = ref(false);

onMounted(() => {
  rocketStore.getRockets();
});

const goToDetail = (id: string) => {
  router.push(`/rocket/${id}`);
};

const addRocket = async (data: Rocket) => {
  const payload: Rocket = {
    ...data,
    id: new Date().getTime().toString(),
  };
  rocketStore.addRocket(payload);
};

const openModalAddRocket = () => {
  modalAddRocket.value = true;
};

const closeModalAddRocket = () => {
  modalAddRocket.value = false;
};
</script>
