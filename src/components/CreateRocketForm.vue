<script setup lang="ts">
import { reactive } from "vue";
import { useLocalRocketCrudStore } from "@/stores/locale-rocket-crud.store";
import type { Rocket } from "@/schema/rocket.schema";

// emit events to parent
const emit = defineEmits<{
  (e: "create-success", rocket: Rocket): void;
}>();

const store = useLocalRocketCrudStore();

const form = reactive<Partial<Rocket>>({
  name: "",
  description: "",
  flickr_images: [""],
  first_flight: "",
  country: "",
  company: "",
  stages: undefined,
  boosters: undefined,
  cost_per_launch: undefined,
  success_rate_pct: undefined,
});

const submit = async () => {
  const rocket = await store.createRocket({
    ...form,
    flickr_images: form.flickr_images?.filter(Boolean) ?? [],
  } as Rocket);

  emit("create-success", rocket);

  Object.assign(form, {
    name: "",
    description: "",
    flickr_images: [""],
    first_flight: "",
    country: "",
    company: "",
    stages: undefined,
    boosters: undefined,
    cost_per_launch: undefined,
    success_rate_pct: undefined,
  });
};
</script>

<template>
  <form
    @submit.prevent="submit"
    class="mx-auto max-w-2xl space-y-2 rounded-2xl bg-white"
  >
    <h2 class="text-xl font-semibold">Create Rocket</h2>

    <div>
      <label class="block text-sm font-medium">Rocket Name</label>
      <input
        v-model="form.name"
        type="text"
        required
        class="mt-1 w-full rounded-lg border px-3 py-1"
      />
    </div>

    <div>
      <label class="block text-sm font-medium">Description</label>
      <textarea
        v-model="form.description"
        rows="3"
        required
        class="mt-1 w-full rounded-lg border px-3 py-1"
      />
    </div>

    <div>
      <label class="block text-sm font-medium">Image URL</label>
      <input
        v-model="form.flickr_images![0]"
        type="url"
        placeholder="https://..."
        class="mt-1 w-full rounded-lg border px-3 py-1"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium">First Flight</label>
        <input
          v-model="form.first_flight"
          type="date"
          class="mt-1 w-full rounded-lg border px-3 py-1"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Country</label>
        <input
          v-model="form.country"
          type="text"
          class="mt-1 w-full rounded-lg border px-3 py-1"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium">Company</label>
      <input
        v-model="form.company"
        type="text"
        class="mt-1 w-full rounded-lg border px-3 py-1"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium">Stages</label>
        <input
          v-model.number="form.stages"
          type="number"
          min="0"
          class="mt-1 w-full rounded-lg border px-3 py-1"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Boosters</label>
        <input
          v-model.number="form.boosters"
          type="number"
          min="0"
          class="mt-1 w-full rounded-lg border px-3 py-1"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium">Cost per Launch ($)</label>
        <input
          v-model.number="form.cost_per_launch"
          type="number"
          min="0"
          class="mt-1 w-full rounded-lg border px-3 py-1"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Success Rate (%)</label>
        <input
          v-model.number="form.success_rate_pct"
          type="number"
          min="0"
          max="100"
          class="mt-1 w-full rounded-lg border px-3 py-1"
        />
      </div>
    </div>

    <p v-if="store.error" class="text-sm text-red-600">
      {{ store.error }}
    </p>

    <button
      type="submit"
      :disabled="store.creating"
      class="w-full rounded-xl bg-indigo-600 py-1 text-white hover:bg-indigo-700 disabled:opacity-60"
    >
      {{ store.creating ? "Creating..." : "Create Rocket" }}
    </button>
  </form>
</template>
