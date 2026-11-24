<template>
  <v-dialog v-model="open" max-width="640" aria-labelledby="add-rocket-title">
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="primary" prepend-icon="mdi-plus">
        Tambah rocket
      </v-btn>
    </template>
    <v-card>
      <v-card-title id="add-rocket-title" class="pt-5">
        Tambah rocket lokal
      </v-card-title>
      <v-card-text>
        <v-form ref="form" validate-on="submit" @submit.prevent="submit">
          <v-text-field
            v-model="name"
            label="Nama rocket *"
            :rules="[required]"
            maxlength="150"
          />
          <v-textarea
            v-model="description"
            label="Deskripsi *"
            :rules="[required]"
            rows="3"
          />
          <v-text-field
            v-model="imageUrl"
            label="URL gambar (opsional)"
            placeholder="https://…"
            :rules="[imageRule]"
          />
          <v-text-field
            v-model="launchCost"
            label="Biaya per peluncuran, USD (opsional)"
            type="number"
            min="0"
            step="any"
            :rules="[costRule]"
          />
          <v-text-field v-model="country" label="Negara (opsional)" />
          <v-text-field
            v-model="firstFlight"
            label="Penerbangan pertama (opsional)"
            type="date"
            :rules="[dateRule]"
          />
          <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
            {{ error }}
          </v-alert>
          <div class="d-flex justify-end flex-wrap ga-3">
            <v-btn variant="text" :disabled="saving" @click="open = false">
              Batal
            </v-btn>
            <v-btn color="primary" type="submit" :loading="saving">
              Simpan rocket
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { VForm } from "vuetify/components";
import { useRocketStore } from "@/stores/rockets";
import { safeImageUrl, validDate } from "@/utils/rocket";

const store = useRocketStore();
const open = ref(false);
const form = ref<InstanceType<typeof VForm> | null>(null);
const name = ref("");
const description = ref("");
const imageUrl = ref("");
const launchCost = ref("");
const country = ref("");
const firstFlight = ref("");
const saving = ref(false);
const error = ref<string | null>(null);

const required = (value: string) => !!value?.trim() || "Wajib diisi.";
const imageRule = (value: string) =>
  !value?.trim() ||
  !!safeImageUrl(value) ||
  "Masukkan URL HTTP atau HTTPS yang valid.";
const costRule = (value: string) =>
  !value?.trim() ||
  (Number.isFinite(Number(value)) && Number(value) >= 0) ||
  "Biaya harus berupa angka nol atau lebih.";
const dateRule = (value: string) =>
  !value || validDate(value) || "Masukkan tanggal yang valid.";

watch(open, () => {
  name.value = "";
  description.value = "";
  imageUrl.value = "";
  launchCost.value = "";
  country.value = "";
  firstFlight.value = "";
  error.value = null;
  form.value?.resetValidation();
});

async function submit() {
  if (saving.value) return;
  saving.value = true;
  error.value = null;
  try {
    const result = await form.value?.validate();
    if (!result?.valid) return;
    store.addRocket({
      name: name.value,
      description: description.value,
      imageUrl: imageUrl.value.trim() || null,
      launchCost: launchCost.value.trim() ? Number(launchCost.value) : null,
      country: country.value.trim() || null,
      firstFlight: firstFlight.value || null,
    });
    open.value = false;
  } catch (cause) {
    error.value =
      cause instanceof Error ? cause.message : "Rocket gagal ditambahkan.";
  } finally {
    saving.value = false;
  }
}
</script>
