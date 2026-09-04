<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLaunchersStore, type SortDirection } from '@/stores/launchers'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import RocketAddDialog from '@/components/RocketAddDialog.vue'
import StateBlock from '@/components/StateBlock.vue'

const store = useLaunchersStore()
const { items, listState, listError } = storeToRefs(store)

const filter = ref('')
const country = ref<string | null>(null)
const sort = ref<SortDirection>('none')

const visible = computed(() => store.filtered({
  query: filter.value,
  country: country.value,
  sort: sort.value,
}))

store.loadList()
</script>

<template>
  <v-container>
    <div class="d-flex align-center flex-wrap ga-3 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>
        <p class="text-medium-emphasis text-body-2 mt-1">
          {{ items.length }} rockets from the Launch Library 2 API
        </p>
      </div>
      <v-spacer />
      <RocketAddDialog @add="store.addLocal" />
    </div>

    <div class="mb-6">
      <v-row dense>
        <v-col
          cols="12"
          sm="6"
          md="5"
        >
          <RocketFilter v-model="filter" />
        </v-col>
        <v-col
          cols="6"
          sm="3"
          md="3"
        >
          <v-select
            v-model="country"
            :items="store.countries"
            label="Country"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
          />
        </v-col>
        <v-col
          cols="6"
          sm="3"
          md="4"
        >
          <v-btn-toggle
            v-model="sort"
            :items="[
              { value: 'none', title: 'Default' },
              { value: 'asc', title: 'A–Z' },
              { value: 'desc', title: 'Z–A' },
            ]"
            mandatory
            color="primary"
            variant="outlined"
            density="comfortable"
            class="fill-height"
          />
        </v-col>
      </v-row>
    </div>

    <StateBlock
      v-if="listState !== 'success'"
      :state="listState === 'idle' ? 'loading' : listState"
      :error="listError"
      empty-message="No rockets available."
      @retry="store.loadList"
    />

    <v-row v-else-if="visible.length === 0">
      <v-col>
        <StateBlock
          state="success"
          empty-message="No rockets match your filter."
        />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="rocket in visible"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>
  </v-container>
</template>
