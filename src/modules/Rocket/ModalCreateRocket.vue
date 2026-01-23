<script setup lang="ts">
import { ref, reactive, toRaw } from "vue";
import { useRocketStore } from "@/stores/rocket.store";
import type { Rocket } from "@/types/rocket";

const isOpenModal = defineModel<boolean>({ required: true });

const fileInput = ref<HTMLInputElement | null>(null);
const dateMenu = ref(false);

const store = useRocketStore();

const form = reactive<Rocket>({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  country: "",
  cost_per_launch: 0,
  first_flight: "",
  flickr_images: [],
  company: "",
});

const isSubmitting = ref(false);
const success = ref(false);

const close = () => {
  isOpenModal.value = false;
  success.value = false;
};

const openFile = () => {
  fileInput.value?.click();
};

const handleImageChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert("File too large (max 5MB)");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    form.flickr_images = [reader.result as string];
  };
  reader.readAsDataURL(file);
};

const handleSubmit = () => {
  const payload: Rocket = { ...form };

  isSubmitting.value = true;
  store.addRocket(payload);

  setTimeout(() => {
    isSubmitting.value = false;
    success.value = true;
    console.log(toRaw(store.createdRockets));
    setTimeout(close, 1500);
  }, 1000);
};
</script>

<template>
  <v-dialog
    v-model="isOpenModal"
    max-width="520"
    persistent
    transition="dialog-bottom-transition"
    z-index="60"
  >
    <v-card class="dialog-card">
      <!-- Header -->
      <v-card-title class="dialog-header">
        <div class="title-wrap">
          <v-icon color="blue" icon="mdi-plus-circle" />
          <span>Register New Rocket</span>
        </div>

        <v-btn icon="mdi-close" variant="text" color="grey" @click="close" />
      </v-card-title>

      <!-- Body -->
      <v-card-text class="dialog-body">
        <!-- SUCCESS -->
        <div v-if="success" class="success-wrap">
          <div class="success-icon">
            <v-icon icon="mdi-check" size="32" />
          </div>
          <p>Rocket Registered Successfully!</p>
        </div>

        <!-- FORM -->
        <v-form v-else @submit.prevent="handleSubmit">
          <!-- Image upload -->
          <div class="field">
            <label class="label">Rocket Visual</label>

            <div
              class="image-drop"
              :class="{ filled: !!form.flickr_images[0] }"
              @click="!form.flickr_images[0] && openFile()"
            >
              <template v-if="form.flickr_images[0]">
                <img :src="form.flickr_images[0]" />

                <div class="image-overlay">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    color="blue"
                    @click.stop="openFile"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    color="red"
                    @click.stop="form.flickr_images = []"
                  />
                </div>
              </template>

              <template v-else>
                <v-icon icon="mdi-cloud-upload" size="36" />
                <p>Drop image or click to upload</p>
                <span>PNG / JPG • max 5MB</span>
              </template>

              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                hidden
                @change="handleImageChange"
              />
            </div>
          </div>

          <!-- Name -->
          <v-text-field v-model="form.name" label="Rocket Name" required />

          <!-- Company -->
          <v-text-field v-model="form.company" label="Company" required />

          <!-- Country + Cost -->
          <div class="grid">
            <v-text-field v-model="form.country" label="Country" required />

            <v-text-field
              v-model.number="form.cost_per_launch"
              label="Cost per Launch"
              type="number"
            />
          </div>

          <!-- First Flight -->
          <v-menu v-model="dateMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field
                v-model="form.first_flight"
                label="First Flight"
                readonly
                v-bind="props"
              />
            </template>

            <v-date-picker
              v-model="form.first_flight"
              @update:modelValue="dateMenu = false"
            />
          </v-menu>

          <!-- Description -->
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
            auto-grow
          />

          <!-- Submit -->
          <v-btn
            type="submit"
            block
            height="48"
            class="submit-btn"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >
            <template #loader>
              <v-icon icon="mdi-loading" class="spin" />
              Initializing Build...
            </template>

            Confirm Rocket Build
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-card {
  background: #111827;
  border-radius: 16px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrap {
  display: flex;
  gap: 12px;
  font-weight: 700;
}

.image-drop {
  height: 160px;
  border: 2px dashed #374151;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.image-drop.filled {
  border: none;
}

.image-drop img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
}

.image-drop:hover .image-overlay {
  opacity: 1;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.submit-btn {
  margin-top: 16px;
  background: #2563eb;
  font-weight: 700;
}

.spin {
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-wrap {
  text-align: center;
  padding: 40px 0;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: rgba(34, 197, 94, 0.2);
  border-radius: 50%;
  margin: 0 auto 16px;
}
</style>
