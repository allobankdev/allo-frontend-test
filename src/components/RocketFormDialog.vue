<template>
  <v-dialog
    v-model="isOpen"
    max-width="520"
  >
    <v-card>
      <v-card-title>Add New Rocket</v-card-title>
      <v-card-text>
        <v-form
          ref="formRef"
          v-model="isValid"
        >
          <v-text-field
            v-model="form.full_name"
            label="Rocket name *"
            :rules="[(v: string) => !!v || 'Name is required']"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
          />
          <v-text-field
            v-model="form.image_url"
            label="Image URL"
          />
          <v-text-field
            v-model="form.launch_cost"
            label="Cost per launch"
          />
          <v-text-field
            v-model="form.country_code"
            label="Country code (e.g. USA)"
          />
          <v-text-field
            v-model="form.maiden_flight"
            label="First flight (YYYY-MM-DD)"
            type="date"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!isValid"
          @click="submit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { NewRocketInput } from "@/types/rocket";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [payload: NewRocketInput];
}>();

const isOpen = ref(props.modelValue);
const isValid = ref(false);
const formRef = ref();

const emptyForm = (): NewRocketInput => ({
  full_name: "",
  description: null,
  image_url: null,
  launch_cost: null,
  maiden_flight: null,
  country_code: null,
});

const form = reactive<NewRocketInput>(emptyForm());

watch(
  () => props.modelValue,
  (val) => (isOpen.value = val),
);
watch(isOpen, (val) => emit("update:modelValue", val));

function close() {
  isOpen.value = false;
}

function submit() {
  emit("submit", { ...form });
  Object.assign(form, emptyForm());
  formRef.value?.reset();
  close();
}
</script>
