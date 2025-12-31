<script setup lang="ts">
import { computed, ref } from "vue";
import Card from "@/components/commons/Card.vue";
import Skeleton from "@/components/commons/Skeleton.vue";
import { useApi, type Item } from "@/components/fetchData/UseApi.vue";

interface IProps {
  item?: Item | any;
  loading?: boolean;
}

const { get } = useApi();
const isModalOpen = ref(false);

const props = withDefaults(defineProps<IProps>(), {
  loading: false,
});

// get first image safely
const imageUrl = computed(() => {
  return props.item?.flickr_images?.[0] || null;
});
</script>

<template>
  <Card class="hover:shadow-lg transition-shadow overflow-hidden">
    <!-- Image -->
    <div class="relative w-full h-40 bg-gray-100">
      <Skeleton v-if="loading" height="100%" />

      <img
        v-else-if="imageUrl"
        :src="imageUrl"
        :alt="item?.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />

      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400 text-sm"
      >
        No Image
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-3">
      <template v-if="loading">
        <Skeleton height="24px" class="mb-2" />
        <Skeleton height="16px" class="mb-2" />
        <Skeleton height="16px" width="60%" />
      </template>

      <template v-else-if="item">
        <h4 class="font-semibold text-lg text-gray-900 mb-2">
          {{ item.name }}
        </h4>

        <p class="text-gray-600 text-sm mb-3 line-clamp-2">
          {{ item.description }}
        </p>

        <div class="flex justify-between items-center text-sm">
          <span class="text-blue-600 font-bold">
            ${{ item.cost_per_launch?.toLocaleString() }}
          </span>

          <span
            class="px-2 py-1 rounded text-xs"
            :class="
              item.active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            "
          >
            {{ item.active ? "Active" : "Inactive" }}
          </span>
        </div>
      </template>

      <template v-else>
        <p class="text-gray-400 text-center">No data available</p>
      </template>
    </div>
  </Card>
</template>
