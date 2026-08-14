<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card rounded="xl">
      <v-card-title class="bg-primary text-white py-4 px-6 d-flex align-center">
        <v-icon icon="mdi-rocket-launch" class="mr-3"></v-icon>
        <span class="text-h6 font-weight-bold">Tambah Roket Baru</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-text-field
            v-model="rocketData.full_name"
            label="Nama Roket *"
            variant="outlined"
            :rules="[v => !!v || 'Nama roket wajib diisi']"
            required
            class="mb-2"
          ></v-text-field>

          <v-textarea
            v-model="rocketData.description"
            label="Deskripsi *"
            variant="outlined"
            :rules="[v => !!v || 'Deskripsi wajib diisi']"
            required
            rows="3"
            class="mb-2"
          ></v-textarea>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="rocketData.cost_per_launch"
                label="Biaya Peluncuran ($)"
                variant="outlined"
                type="number"
                prefix="$"
                class="mb-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="country"
                label="Kode Negara (e.g. USA)"
                variant="outlined"
                class="mb-2"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <v-text-field
            v-model="rocketData.image_url"
            label="URL Gambar (Opsional)"
            variant="outlined"
            prepend-inner-icon="mdi-image-outline"
            placeholder="https://..."
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="close"
          class="text-none px-4"
          rounded="pill"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="submit"
          :disabled="!valid"
          class="text-none px-6"
          rounded="pill"
        >
          Simpan Roket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { useRocketStore } from '../stores/rocketStore';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const store = useRocketStore();
const form = ref<any>(null);
const valid = ref(false);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const defaultState = {
  full_name: '',
  description: '',
  cost_per_launch: '',
  image_url: '',
};

const rocketData = reactive({ ...defaultState });
const country = ref('');

watch(dialog, (newVal) => {
  if (!newVal) {
    Object.assign(rocketData, defaultState);
    country.value = '';
    if (form.value) form.value.resetValidation();
  }
});

const close = () => {
  dialog.value = false;
};

const submit = async () => {
  if (!form.value) return;
  const { valid: isValid } = await form.value.validate();
  
  if (isValid) {
    store.addFakeRocket({
      full_name: rocketData.full_name,
      description: rocketData.description,
      image_url: rocketData.image_url || null,
    });
    
    emit('success');
    close();
  }
};

</script>
