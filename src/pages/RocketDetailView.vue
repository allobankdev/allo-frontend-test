<script setup lang="ts">
import { onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRocketStore } from "../stores/rocketStore";
import StatusView from "../components/StatusView.vue";
import RocketImage from "../components/RocketImage.vue";
import { formatCost, formatDate, formatText } from "../utils/format";

const props = defineProps<{ id: string }>();

const store = useRocketStore();
const { selected, detailStatus, detailError } = storeToRefs(store);

const load = (): Promise<void> => store.loadRocket(props.id);
onMounted(load);
watch(() => props.id, load);
</script>

<template>
  <section>
    <ol
      class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse mb-4"
    >
      <li class="inline-flex items-center">
        <svg
          class="w-4 h-4 me-1.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
          />
        </svg>
        <RouterLink
          to="/"
          class="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand"
          >Home</RouterLink
        >
      </li>
      <li>
        <div class="flex items-center space-x-1.5">
          <svg
            class="w-3.5 h-3.5 rtl:rotate-180 text-body"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m9 5 7 7-7 7"
            />
          </svg>
          <a
            href="#"
            class="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand"
            >Detail Rocket</a
          >
        </div>
      </li>
    </ol>

    <StatusView :status="detailStatus" :error="detailError" @retry="load">
      <article v-if="selected" class="detail">
        <RocketImage :src="selected.imageUrl" :alt="selected.name" />
        <div>
          <h1>{{ selected.name }}</h1>
          <p>{{ formatText(selected.description) }}</p>
          <dl class="facts">
            <div>
              <dt>Cost per launch</dt>
              <dd>{{ formatCost(selected.launchCost) }}</dd>
            </div>
            <div>
              <dt>Country</dt>
              <dd>{{ formatText(selected.country) }}</dd>
            </div>
            <div>
              <dt>First flight</dt>
              <dd>{{ formatDate(selected.maidenFlight) }}</dd>
            </div>
          </dl>
        </div>
      </article>
    </StatusView>
  </section>
</template>
