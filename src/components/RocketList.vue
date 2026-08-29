<template>
  <v-container class="py-6">
    <div>
      <v-img
        :width="200"
        aspect-ratio="16/9"
        cover
        src="../assets/spacex-logo-white.png"
      />
    </div>

    <FilterTab />
    <v-btn color="blue-grey-lighten-5" block @click="addRocket">
      Add
    </v-btn>
    <!-- <FilterSearch/> -->
    <ModalCard @open-modal="openModal" :modelValue="isModal" />
    <ModalDetailCard @open-modal="openModalDetail" :modelValue="isModalDetail" />
    <RocketCard @open-modal="openModalDetail" />

    <!-- <v-row justify="center">
      <v-col cols="12" md="12">
        <v-card>
          <v-card-title class="text-h6 font-weight-bold">
            Rocket List
          </v-card-title>

          <v-divider></v-divider>

        <v-list lines="three" style="background: none;">
          <v-list-item v-for="rocket in rockets" :key="rocket.id" class="border">
            <template #prepend>
              <v-avatar size="64">
                <v-img :src="rocket.image" cover></v-img>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium" style="color: whitesmoke;">
              {{ rocket.title }}
            </v-list-item-title>

            <v-list-item-subtitle style="color: whitesmoke;">
              {{ rocket.subtitle }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        </v-card>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isModal = ref(false);
const isModalDetail = ref(false);
const openModal = (e: boolean) => {
  isModal.value = e;
};
const openModalDetail = (e: boolean) => {
  isModalDetail.value = e;
};

const addRocket = () => {
  isModal.value = true;
};
</script>

<style scoped>
.v-list-item {
  padding-block: 16px;
}
</style>
