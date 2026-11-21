<script setup lang="ts">
import { reactive } from "vue";
import { X, Rocket } from "lucide-vue-next";
import type { Rocket as RocketType } from "@/types/rockets";

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  created: [rocket: RocketType];
}>();

const form = reactive({
  name: "",
  image: "",
  description: "",
  costPerLaunch: "",
  country: "",
  firstFlight: "",
});

const resetForm = () => {
  Object.assign(form, {
    name: "",
    image: "",
    description: "",
    costPerLaunch: "",
    country: "",
    firstFlight: "",
  });
};

const close = () => {
  resetForm();
  emit("update:modelValue", false);
};

const submit = () => {
  const rocket: RocketType = {
    id: `local-${Date.now()}`,
    name: form.name.trim(),
    image: form.image.trim() || null,
    description: form.description.trim(),
    costPerLaunch: form.costPerLaunch
      ? Number(form.costPerLaunch)
      : null,
    country: form.country.trim() || null,
    firstFlight: form.firstFlight || null,
    isLocal: true,
  };

  emit("created", rocket);
  close();
};
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
    @click.self="close"
  >
    <div class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <div class="flex items-center gap-2">
            <Rocket :size="20" class="text-blue-600" />
            <h2 class="text-xl font-bold text-slate-900">
              Add New Rocket
            </h2>
          </div>
          <p class="mt-1 text-sm text-slate-500">
            Add your own rocket to the collection.
          </p>
        </div>

        <button
          type="button"
          class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          @click="close"
        >
          <X :size="20" />
        </button>
      </div>

      <form @submit.prevent="submit">
        <div class="max-h-[70vh] space-y-5 overflow-y-auto p-6">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              Rocket name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              required
              maxlength="100"
              placeholder="e.g. Falcon 9"
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              Image URL
            </label>
            <input
              v-model="form.image"
              type="url"
              placeholder="https://example.com/rocket.jpg"
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              required
              rows="4"
              maxlength="2000"
              placeholder="Describe this rocket..."
              class="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">
                Cost per launch (USD)
              </label>
              <input
                v-model="form.costPerLaunch"
                type="number"
                min="0"
                placeholder="e.g. 67000000"
                class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">
                Country
              </label>
              <input
                v-model="form.country"
                placeholder="e.g. United States"
                class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              First flight
            </label>
            <input
              v-model="form.firstFlight"
              type="date"
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            @click="close"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add Rocket
          </button>
        </div>
      </form>
    </div>
  </div>
</template>