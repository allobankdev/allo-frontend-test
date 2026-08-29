<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" text="Add Rocket" variant="flat"></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="Add Rocket">
            <v-card>
              <v-row>
                <v-text-field label="Name" v-model="formData.name" required></v-text-field>
              </v-row>
              <v-row>
                <v-text-field label="Description" v-model="formData.description" required></v-text-field>
              </v-row>
              <v-row>
                <v-text-field label="Image" v-model="formData.image" required></v-text-field>
              </v-row>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text="Submit" @click="submit()"></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <div class="text-center">
        <h1 class="text-h2 font-weight-bold">Rockets</h1>
      </div>
      <v-row>
        <v-col v-for="item in items" cols="12">
          <v-card @click="goToDetail(item)" hover class="py-4" color="surface-variant" rounded="lg" variant="outlined">
            <v-carousel cycle hide-delimiters>
              <v-carousel-item v-for="(src, i) in item.flickr_images" :key="i" :src="src" cover></v-carousel-item>
            </v-carousel>
            <div class="py-2 text-center">
              <h2 class="text-h5 font-weight-bold">{{ item.name }}</h2>
              <p>{{ item.description }}</p>
            </div>
            <v-overlay opacity=".12" scrim="primary" contained model-value persistent />
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
  <Detail v-if="selectedItem" :item="selectedItem" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vuetify/lib/composables/router.mjs';

const items = ref(null);
const loading = ref(true);
const selectedItem = ref(null);
const router = useRouter();
const isActive = ref(false);
const formData = reactive({
  name: '',
  description: '',
  image: ''
})

const fetchData = async () => {
  try {
    if (localStorage.getItem('rockets') !== null) {
      const response = await axios.get('https://api.spacexdata.com/v4/rockets');
      localStorage.setItem('rockets', JSON.stringify(response.data));
      items.value = JSON.parse(localStorage.getItem('rockets')!);
    }
  } catch (err) {
    console.log('Error : ', err);
  } finally {
    loading.value = false;
  }
}

function goToDetail(item: any) {
  router?.push(`/details/${item.id}`)
}

function submit() {
  if(localStorage.getItem('rockets') !== null) {
    const data: any[] =  JSON.parse(localStorage.getItem('rockets')!);
    data.push({
      name: formData.name,
      description: formData.description,
      flickr_images: [formData.image]
    });
    localStorage.setItem('rockets', JSON.stringify(data));
    items.value = JSON.parse(localStorage.getItem('rockets')!);
  }
  isActive.value = false;
}

onMounted(fetchData);
</script>
