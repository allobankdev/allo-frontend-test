<template>
  <v-container>
    <div v-if="isDataRocket.loading" class="overlay">
      <div class="spinner">
      </div>
    </div>
    <v-text-field v-model="search" label="Cari Nama" class="mb-4"></v-text-field>
    <v-row>
      <v-col v-for="(item, index) in visibleRocket" :key="index" cols="12" md="4" >
        <v-card max-width="400" class="mx-auto fade-in hover-effect equal-height">
          <v-img @click="detailData(item)" style="cursor: pointer" class="align-end text-white" height="200" :src="item.flickr_images[1]" cover>
            <v-card-title style="color: #e3e3e3">{{ item.name }}</v-card-title>
          </v-img>
          <v-card-text>
            <div style="color: #9f9f9f">{{ item.description }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-btn v-if="showSeeMore" color="blue" @click="loadMore" class="mt-4">See More</v-btn>

    <DialogDetail
      v-model="openDialog"
      :item="dataDetail"
      @close="openDialog = false"
    />
  </v-container>
</template>

<script lang="ts" setup>
import {ref, computed, onBeforeMount} from 'vue';
import DialogDetail from "@/components/DialogDetail.vue";
import { dataRocket } from "@/stores/dataRocket";

const search = ref('');
const dataDetail =ref(null);
const openDialog = ref(false);
const isDataRocket = dataRocket();
const itemsPerPage = 3;
const visibleCount = ref(itemsPerPage);

const detailData = (val: any) => {
  dataDetail.value = val
  openDialog.value = true;
}

const filterName = computed(() => {
  return isDataRocket.data.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase()));
});

const visibleRocket = computed(() => filterName.value.slice(0, visibleCount.value));
const showSeeMore = computed(() => visibleCount.value < filterName.value.length);

const loadMore = () => {
  visibleCount.value += itemsPerPage;
};


onBeforeMount(async ()=> {
  await isDataRocket.fetchData()
});

</script>

<style scoped>
.equal-height {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.equal-height .v-card-text {
  flex-grow: 1;
}
</style>

