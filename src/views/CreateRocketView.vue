<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useRocketStore } from "@/stores/rocketStores";

const store = useRocketStore();
const router = useRouter();
const name = ref("");
const description = ref("");
const country = ref("");
const company = ref("");
const cost = ref<number>(0);
const status = ref<"active" | "reusable">("active");
const active = computed<boolean>(() => status.value === "active");
const reusable = computed<boolean>(() => status.value === "reusable");
const heightMeters = ref<number>(0);
const heightFeet = ref<number>(0);
const massKg = ref<number>(0);
const massLb = ref<number>(0);

const submit = (): void => {
  store.addRocket({
    name: name.value,
    description: description.value,
    country: country.value,
    company: company.value,
    cost_per_launch: cost.value,
    first_flight: new Date().toISOString().split("T")[0],
    active: active.value,
      flickr_images: imageBase64.value,
    first_stage: {
      reusable: reusable.value,
    },
    height: {
      meters: heightMeters.value,
      feet: heightFeet.value,
    },
    mass: {
      kg: massKg.value,
      lb: massLb.value,
    },
    isLocal: true,
  });

  router.push("/");
};

const imageBase64 = ref<string[]>([]);

const onImageChange = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const files = Array.from(input.files);

  imageBase64.value = await Promise.all(
    files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject("Failed to read file");
          reader.readAsDataURL(file);
        })
    )
  );
};

</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <v-card class="pa-6">
      <v-card-title class="text-h4 font-weight-bold mb-6 px-0">
        ➕ Add New Rocket
      </v-card-title>

      <v-form @submit.prevent="submit">
        <v-row>
          <!-- Rocket Name -->
          <v-col cols="12">
            <v-text-field
              v-model="name"
              label="Rocket Name"
              placeholder="Enter rocket name"
              variant="outlined"
              density="comfortable"
              required
            ></v-text-field>
          </v-col>

          <!-- Description -->
          <v-col cols="12">
            <v-textarea
              v-model="description"
              label="Description"
              placeholder="Enter rocket description"
              variant="outlined"
              rows="3"
              density="comfortable"
            ></v-textarea>
          </v-col>

          <!-- Country -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="country"
              label="Country"
              placeholder="Enter country"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
          </v-col>

          <!-- Company -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="company"
              label="Company"
              placeholder="Enter company name"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
          </v-col>

          <!-- Cost per Launch -->
          <v-col cols="12">
            <v-text-field
              v-model.number="cost"
              label="Cost per Launch"
              placeholder="Enter cost"
              type="number"
              variant="outlined"
              density="comfortable"
              prefix="$"
            ></v-text-field>
          </v-col>

          <!-- Image Upload -->
          <v-col cols="12">
            <v-file-input
              label="Rocket Images"
              placeholder="Select images"
              variant="outlined"
              density="comfortable"
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
              @change="onImageChange"
            ></v-file-input>
          </v-col>

          <!-- Status Radio Buttons -->
          <v-col cols="12">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Status</label>
            <v-radio-group v-model="status" inline>
              <v-radio label="Active" value="active" color="primary"></v-radio>
              <v-radio label="Reusable" value="reusable" color="success"></v-radio>
            </v-radio-group>
          </v-col>

          <!-- Height Section -->
          <v-col cols="12">
            <div class="text-subtitle-2 font-weight-medium mb-2">Height</div>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="heightMeters"
              label="Meters"
              placeholder="0"
              type="number"
              variant="outlined"
              density="comfortable"
              suffix="m"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="heightFeet"
              label="Feet"
              placeholder="0"
              type="number"
              variant="outlined"
              density="comfortable"
              suffix="ft"
            ></v-text-field>
          </v-col>

          <!-- Mass Section -->
          <v-col cols="12">
            <div class="text-subtitle-2 font-weight-medium mb-2">Mass</div>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="massKg"
              label="Kilograms"
              placeholder="0"
              type="number"
              variant="outlined"
              density="comfortable"
              suffix="kg"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="massLb"
              label="Pounds"
              placeholder="0"
              type="number"
              variant="outlined"
              density="comfortable"
              suffix="lb"
            ></v-text-field>
          </v-col>

          <!-- Action Buttons -->
          <v-col cols="12" class="mt-4">
            <div class="flex gap-3">
              <v-btn
                type="submit"
                color="success"
                size="large"
                variant="flat"
                prepend-icon="mdi-check"
              >
                Save Rocket
              </v-btn>
              <v-btn
                type="button"
                color="grey"
                size="large"
                variant="outlined"
                prepend-icon="mdi-close"
                @click="router.back()"
              >
                Cancel
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<style scoped>
</style>

