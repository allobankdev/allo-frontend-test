<template>
  <v-card flat width="100%">
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-rocket" />
      &nbsp; Rocket List

      <v-spacer />

      <v-text-field
        v-if="searchable"
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      />
    </v-card-title>

    <v-divider />
    <v-data-table v-model:search="search" :filter-keys="searchKey" :headers="headers" :items="items">
      <template #header.stock>
        <div class="text-end">Stock</div>
      </template>

      <template #item.image="{ item }">
        <v-card class="my-2" elevation="2" rounded>
          <v-img
            :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.image}`"
            height="64"
            cover
          />
        </v-card>
      </template>

      <template #item.rating="{ item }">
        <v-rating
          :model-value="item.rating"
          color="orange-darken-2"
          density="compact"
          size="small"
          readonly
        />
      </template>

      <template #item.stock="{ item }">
        <div class="text-end">
          <v-chip
            :color="item.stock ? 'green' : 'red'"
            :text="item.stock ? 'In stock' : 'Out of stock'"
            class="text-uppercase"
            size="small"
            label
          />
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps({
  searchable: Boolean,
  searchKey: Array<string>,
  pageable: Boolean,
  headers: {
    type: Array,
    default: () => defaultHeaders,
  },
  items: {
    type: Array,
    default: () => defaultItems,
  },
});

onMounted(() => {
  console.log("Component is now mounted!");

  if (props.headers.length < 1) {
    console.log("Columns is empty");
  }
});

const search = ref("");
</script>

<script lang="ts">
  const defaultHeaders = [
  { title: "Name", key: "name", value: "name" },
  { title: "Image", key: "image", value: "image" },
  { title: "Price", key: "price", value: "price" },
  { title: "Rating", key: "rating", value: "rating" },
  { title: "Stock", key: "stock", value: "stock" },
];
const defaultItems = [
  {
    name: "Nebula GTX 3080",
    image: "1.png",
    price: 699.99,
    rating: 5,
    stock: true,
  },
  {
    name: "Galaxy RTX 3080",
    image: "2.png",
    price: 799.99,
    rating: 4,
    stock: false,
  },
  {
    name: "Orion RX 6800 XT",
    image: "3.png",
    price: 649.99,
    rating: 3,
    stock: true,
  },
  {
    name: "Vortex RTX 3090",
    image: "4.png",
    price: 1499.99,
    rating: 4,
    stock: true,
  },
  {
    name: "Cosmos GTX 1660 Super",
    image: "5.png",
    price: 299.99,
    rating: 4,
    stock: false,
  },
];
</script>
