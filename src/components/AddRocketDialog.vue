<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRocketStore } from "@/stores/rockets";
import type { Result } from "@/types/rocket";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const rocketStore = useRocketStore();
const submitting = ref(false);

const form = reactive({
  full_name: "",
  description: "",
  image_url: "",
  launch_cost: "",
  maiden_flight: "",
  country_code: "",
});

const close = () => {
  emit("update:modelValue", false);
};

const resetForm = () => {
  form.full_name = "";
  form.description = "";
  form.image_url = "";
  form.launch_cost = "";
  form.maiden_flight = "";
  form.country_code = "";
};

const submit = () => {
  if (!form.full_name.trim()) return;

  submitting.value = true;

  const rocket: Omit<Result, "id"> = {
    full_name: form.full_name.trim(),
    description: form.description.trim(),
    image_url: form.image_url.trim(),
    launch_cost: form.launch_cost.trim(),
    maiden_flight: form.maiden_flight.trim(),
    manufacturer: {
      country_code: form.country_code.trim(),
    } as Result["manufacturer"],
    url: "",
    name: "",
    active: false,
    reusable: false,
    family: "",
    program: [],
    variant: "",
    alias: "",
    min_stage: 0,
    max_stage: 0,
    length: 0,
    diameter: 0,
    launch_mass: 0,
    vehicle_range: undefined,
    wiki_url: "",
    total_launch_count: 0,
    consecutive_successful_launches: 0,
    successful_launches: 0,
    failed_launches: 0,
    pending_launches: 0,
    attempted_landings: 0,
    successful_landings: 0,
    failed_landings: 0,
    consecutive_successful_landings: 0
  };

  rocketStore.addRocket(rocket);

  resetForm();
  submitting.value = false;
  close();
};
</script>

<template>
  <div
    v-if="props.modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="close"
  >
    <div
      class="w-full max-w-lg rounded-xl bg-white shadow-xl"
    >
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            Add Rocket
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            Add a new rocket to the current application.
          </p>
        </div>

        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          @click="close"
        >
          <v-icon icon="mdi-close" size="20" />
        </button>
      </div>

      <form @submit.prevent="submit">
        <div class="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Rocket Name
            </label>

            <input
              v-model="form.full_name"
              type="text"
              placeholder="e.g. Falcon 9 Block 5"
              required
              class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Rocket description..."
              class="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Image URL
            </label>

            <input
              v-model="form.image_url"
              type="url"
              placeholder="https://..."
              class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">
                Cost per Launch
              </label>

              <input
                v-model="form.launch_cost"
                type="text"
                placeholder="e.g. 50000000"
                class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">
                Country
              </label>

              <input
                v-model="form.country_code"
                type="text"
                placeholder="e.g. USA"
                class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              First Flight
            </label>

            <input
              v-model="form.maiden_flight"
              type="date"
              class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            class="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="close"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="submitting || !form.full_name.trim()"
            class="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <v-icon icon="mdi-plus" size="18" />
            Add Rocket
          </button>
        </div>
      </form>
    </div>
  </div>
</template>