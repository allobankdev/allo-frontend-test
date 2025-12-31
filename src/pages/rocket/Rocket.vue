<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Button from "@/components/commons/Button.vue";
import Modal from "@/components/commons/Modal.vue";
import Input from "@/components/commons/TextInput.vue";
import ItemCard from "./Item.vue";
import { useApi, type Item } from "@/components/fetchData/UseApi.vue";

const isModalOpen = ref(false);
const isDetailModalOpen = ref(false);

const items = ref<Item[] | any>([]);
const detail = ref<Item | null | any>(null);

const isDetailLoading = ref(false);

const { isLoading, error, get, post } = useApi();

const filters = ref({
  search: "",
  country: "",
  active: "all",
});

const filteredItems = computed(() => {
  return items.value.filter((item: any) => {
    const matchSearch =
      !filters.value.search ||
      item.name.toLowerCase().includes(filters.value.search.toLowerCase());

    const matchCountry =
      !filters.value.country || item.country === filters.value.country;

    const matchActive =
      filters.value.active === "all" ||
      (filters.value.active === "active" && item.active) ||
      (filters.value.active === "inactive" && !item.active);

    return matchSearch && matchCountry && matchActive;
  });
});

const formData = ref<Item | any>({
  id: "",
  name: "",
  description: "",
  flickr_images: [],
  cost_per_launch: 0,
  country: "",
  first_flight: "",
  active: true,
});

const openAddModal = () => {
  formData.value = {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    flickr_images: [],
    cost_per_launch: 0,
    country: "",
    first_flight: "",
    active: true,
  };
  isModalOpen.value = true;
};

const handleSubmit = () => {
  if (!formData.value.name || !formData.value.description) {
    alert("Name and description are required");
    return;
  }

  // Add locally (SpaceX API is read-only)
  items.value.unshift({ ...formData.value });

  isModalOpen.value = false;
};

const countries = computed(() => {
  return [...new Set(items.value.map((i: any) => i.country).filter(Boolean))];
});

const fetchItems = async () => {
  const result = await get<Item[]>("/rockets");
  if (result) items.value = result;
};

const handleDetail = async (id: string | number) => {
  isDetailModalOpen.value = true;
  isDetailLoading.value = true;
  detail.value = null;

  const result = await get<Item>(`/rockets/${id}`);
  if (result) detail.value = result;

  isDetailLoading.value = false;
};

onMounted(fetchItems);
</script>

<template>
  <v-overlay
    v-if="isLoading"
    opacity=".40"
    scrim="primary"
    contained
    model-value
    persistent
    class="flex justify-center items-center"
  >
    <span class="font-bold text-4xl">Loading</span>
  </v-overlay>
  <div class="flex flex-col gap-6 w-full p-6 min-h-screen bg-gray-50 px-4 py-2">
    <!-- Header with Add Button -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Items</h1>
        <p class="text-gray-600 mt-1">Manage your items collection</p>
      </div>
      <Button intent="primary" @click="openAddModal" class="rounded-lg">
        + Add New Item
      </Button>
    </div>

    <!-- Filters -->
    <div
      class="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm"
    >
      <!-- Search -->
      <Input
        v-model="filters.search"
        placeholder="Search rocket name..."
        class="w-full md:w-64"
      />

      <!-- Country -->
      <select
        v-model="filters.country"
        class="px-3 py-2 border rounded-lg text-sm"
      >
        <option value="">All Countries</option>
        <option v-for="country in countries" :value="country">
          {{ country }}
        </option>
      </select>

      <!-- Status -->
      <select
        v-model="filters.active"
        class="px-3 py-2 border rounded-lg text-sm"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
    >
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Loading State with Skeletons -->
    <div
      v-if="isLoading && items.length === 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <ItemCard v-for="i in 6" :key="i" :loading="true" />
    </div>

    <!-- Items Grid - Scrollable -->
    <div
      v-else-if="items.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <ItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        @click="handleDetail(item.id)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-16">
      <svg
        class="w-24 h-24 text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p class="text-gray-500 text-lg mb-4">No items found</p>
      <Button intent="primary" @click="openAddModal">
        Add Your First Item
      </Button>
    </div>

    <!-- Add Item Modal -->
    <!-- Add Rocket Modal -->
    <Modal v-model="isModalOpen" title="Add New Rocket" size="md">
      <div class="flex flex-col gap-4 px-4 py-4">
        <Input
          v-model="formData.name"
          label="Rocket Name"
          placeholder="Falcon X"
          required
        />

        <div>
          <label class="text-sm font-medium text-gray-700">Description</label>
          <textarea
            v-model="formData.description"
            rows="4"
            class="w-full px-3 py-2 border rounded-lg border-gray-300! focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-black"
          ></textarea>
        </div>

        <Input
          v-model="formData.cost_per_launch"
          label="Cost per Launch ($)"
          type="number"
        />

        <Input v-model="formData.country" label="Country" placeholder="USA" />

        <Input
          v-model="formData.first_flight"
          label="First Flight"
          type="date"
        />

        <Input
          v-model="formData.flickr_images[0]"
          label="Image URL"
          placeholder="https://..."
        />

        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="formData.active" />
          Active Rocket
        </label>
      </div>

      <template #footer="{ close }">
        <div class="flex justify-end gap-2">
          <Button intent="secondary" @click="close"> Cancel </Button>
          <Button intent="primary" @click="handleSubmit"> Add Rocket </Button>
        </div>
      </template>
    </Modal>

    <!-- Detail Modal -->
    <Modal v-model="isDetailModalOpen" title="Rocket Detail" size="lg">
      <!-- Loading -->
      <div v-if="isDetailLoading" class="flex justify-center items-center h-64">
        <span class="text-xl font-semibold">Loading...</span>
      </div>

      <!-- Content -->
      <div v-else-if="detail" class="space-y-6">
        <!-- Rocket Image -->
        <img
          v-if="detail.flickr_images?.length"
          :src="detail.flickr_images[0]"
          :alt="detail.name"
          class="w-full h-64 object-cover rounded-xl"
        />

        <!-- Rocket Name -->
        <h2 class="text-2xl font-bold text-gray-900 py-2">
          {{ detail.name }}
        </h2>

        <!-- Description -->
        <p class="text-gray-600 leading-relaxed py-2">
          {{ detail.description }}
        </p>

        <!-- Meta Info -->
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-semibold text-gray-700">Cost per Launch</span>
            <p class="text-gray-900">
              ${{ detail.cost_per_launch?.toLocaleString() }}
            </p>
          </div>

          <div>
            <span class="font-semibold text-gray-700">Country</span>
            <p class="text-gray-900">
              {{ detail.country }}
            </p>
          </div>

          <div>
            <span class="font-semibold text-gray-700">First Flight</span>
            <p class="text-gray-900">
              {{ detail.first_flight }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center text-gray-400 py-10">
        No rocket detail available
      </div>
    </Modal>
  </div>
</template>
