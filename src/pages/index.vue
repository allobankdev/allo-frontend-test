<script setup lang="ts">
import { useRocketStore } from '@/stores/rocket';
import type { LocalRocket } from '@/types/rocket';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';

const rocketStore = useRocketStore()
const { query, state, rockets } = storeToRefs(rocketStore)

onMounted(() => {
  rocketStore.getServerRockets()
})

const isOpen = ref(false)

const cols = computed(() => ({
  cols: "12",
  md: "6",
  xl: "3"
}))

const handleSubmit = (payload: Omit<LocalRocket,"id">) => {
  rocketStore.storeLocalRocket(payload)
  isOpen.value = false
}
</script>

<template>
  <v-container class="d-flex flex-column ga-3">
    <div class="d-flex flex-column align-end ga-2">
      <dialog-rocket-form
        v-model="isOpen"
        :disabled="state.list === 'loading'"
        @submit="handleSubmit"
      />
      <v-text-field
        v-model="query"
        class="w-100"
        prepend-inner-icon="mdi-magnify"
        :disabled="state.list === 'loading'"
        placeholder="Search for name or description..."
        hide-details="auto"
      />
    </div>
    <v-row>
      <template v-if="state.list === 'loading'">
        <v-col
          v-for="item in 6"
          :key="item"
          v-bind="cols"
        >
          <v-skeleton-loader
            type="image, article"
          />
        </v-col>
      </template>
      <template v-else-if="state.list === 'success'">
        <template v-if="rockets.length">
          <v-col
            v-for="rocket in rockets"
            :key="rocket.id"
            v-bind="cols"
          >
            <rocket-card
              :rocket="rocket"
              @click="$router.push(`/rockets/${rocket.id}`)"
            />
          </v-col>
        </template>
        <template v-else-if="query">
          <v-empty-state
            icon="mdi-magnify"
            title="Rockets Not Found"
            text="We couldn't find anything matching your search. Try adjusting your keywords or using broader terms."
            class="mx-auto my-12"          
          />
        </template>
      </template>
      <template v-else>
        <v-empty-state
          icon="mdi-magnify"
          title="Failed To Load"
          text="Something went wrong on our end and we couldn't load the rockets. Please try again in a moment."
          class="mx-auto my-12"
          action-text="Retry Request"
          @click:action="rocketStore.getServerRockets"
        />
      </template>
    </v-row>
  </v-container>
</template>