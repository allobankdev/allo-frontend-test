<script lang="ts" setup>
import { onMounted, reactive, watch, ref } from "vue";
import { debounce } from "lodash";
import { useRocket } from "@/store/rocketStore";
import type { RocketParams } from "@/types/rocket";
import { countryOptions, statusOptions } from "@/utils/constant";
import Toolbar from "@/components/Toolbar.vue";
import RocketList from "@/components/RocketList.vue";
import DialogAddRocket from "@/components/DialogAddRocket.vue";

const showDialog = ref(false);
const search = ref("");
const filter = reactive<RocketParams>({
  active: undefined,
  country: undefined,
});

const rocketStore = useRocket();

const fetchRockets = () => {
  rocketStore.fetchRocket({ ...filter, search: search.value });
};

const fetchRocketsDebounced = debounce(fetchRockets, 500);

const afterSubmit = () => {
  fetchRockets()
  showDialog.value = false;
}

onMounted(fetchRockets);
watch(search, fetchRocketsDebounced);
watch(filter, fetchRockets, { deep: true });

</script>

<template>
  <v-container>
    <Toolbar @search="search = $event">
      <v-select
        v-model="filter.active"
        class="select-filter"
        clearable
        :items="statusOptions"
        item-title="label"
        item-value="value"
        label="Status"
        density="compact"
        hide-details
      />
      <v-select
        v-model="filter.country"
        class="select-filter"
        clearable
        :items="countryOptions"
        label="Country"
        density="compact"
        hide-details
      />
      <v-btn
        class="text-none font-weight-regular"
        prepend-icon="mdi-plus"
        color="primary"
        variant="tonal"
        @click="showDialog = true"
      >
        Add
        Rocket
      </v-btn>
    </Toolbar>

    <RocketList
      :data="rocketStore.data"
      :is-loading="rocketStore.loading"
      :error="rocketStore.error"
      @retry="fetchRockets"
    />
  </v-container>

  <DialogAddRocket
    :is-open="showDialog"
    @update:is-open="showDialog = $event"
    @saved="afterSubmit"
  />
</template>
