<template>
    <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <v-btn @click="goBack()" rounded="lg" size="large">Back</v-btn>
            <div class="text-center">
                <h1 class="text-h2 font-weight-bold">{{ item?.name }}</h1>
            </div>
            <v-row>
                <v-col cols="12">
                    <v-card hover class="px-4 py-4" color="surface-variant" rounded="lg" variant="outlined">
                        <v-carousel cycle hide-delimiters>
                            <v-carousel-item v-for="(src, i) in item?.flickr_images" :key="i" :src="src"
                                cover></v-carousel-item>
                        </v-carousel>
                        <v-row class="px-2 py-2">
                            <div class="px-2" cols="4">Company</div>
                            <div class="px-2" cols="1">:</div>
                            <div class="px-2">
                                <p>{{ item?.company }}</p>
                            </div>
                        </v-row>
                        <v-row class="px-2 py-2">
                            <div class="px-2" cols="4">Country</div>
                            <div class="px-2" cols="1">:</div>
                            <div class="px-2">
                                <p>{{ item?.country }}</p>
                            </div>
                        </v-row>
                        <v-overlay opacity=".12" scrim="primary" contained model-value persistent />
                    </v-card>
                </v-col>
            </v-row>
        </v-responsive>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
const item = ref<Item | null>(null);
const loading = ref(true);
const router = useRouter();
const route = useRoute();

const fetchData = async () => {
    try {
        const response = await axios.get(`https://api.spacexdata.com/v4/rockets/${route.params.id}`);
        item.value = response.data;
        console.log(item.value);
    } catch (err) {
        console.log('Error : ', err);
    } finally {
        loading.value = false;
    }
}

function goBack() {
  router.push('/');
}

onMounted(fetchData);
</script>
