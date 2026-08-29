<template>
  <div>
    <!-- Dialog controlled by `open` prop -->
    <v-dialog v-model="localOpen" max-width="720">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Create Rocket</v-toolbar-title>
          <v-spacer />
          <v-btn aria-label="close" icon @click="handleCancel">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-form
            ref="formRef"
            v-model="isValid"
            lazy-validation
            @submit.prevent
          >
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.name"
                  label="Name"
                  :rules="[rules.required]"
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.country"
                  label="Country"
                  :rules="[rules.required]"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
                  label="Description"
                  :rules="[rules.required, rules.minLength(10)]"
                  required
                  rows="4"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.image"
                  label="Image URL"
                  :rules="[rules.required, rules.url]"
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.cost_per_launch"
                  label="Cost per Launch (USD)"
                  :rules="[rules.required, rules.numeric]"
                  required
                  type="number"
                  min="0"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.first_flight"
                  label="First Flight"
                  :rules="[rules.required, rules.date]"
                  required
                  type="date"
                />
              </v-col>

              <v-col cols="12" sm="6" class="pt-0">
                <v-checkbox
                  v-model="form.active"
                  label="Is this rocket currently active?"
                  color="primary"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="handleCancel">Cancel</v-btn>
          <v-btn
            :disabled="!isValid"
            color="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { RocketPayload } from "@/types/rockets";
import { ref, watch } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "submit", payload: RocketPayload): void;
  (e: "cancel"): void;
}>();

const localOpen = ref<boolean>(props?.open);

watch(
  () => props.open,
  (v) => {
    if (v !== undefined) localOpen.value = v;
  }
);

// sync back to parent
watch(localOpen, (v) => {
  emit("update:open", v);
});

// form state
const formRef = ref();
const isValid = ref(false);
const submitting = ref(false);
const form = ref<RocketPayload>({
  name: "",
  description: "",
  image: "",
  cost_per_launch: 0,
  country: "",
  first_flight: "",
  active: false,
});

const rules = {
  required: (v: unknown) =>
    (v !== null && v !== undefined && String(v).trim().length > 0) ||
    "Field is required",
  numeric: (v: unknown) =>
    v === null ||
    v === undefined ||
    v === "" ||
    !isNaN(Number(v)) ||
    "Must be a number",
  minLength: (min: number) => (v: string) =>
    (v && v.trim().length >= min) || `Min ${min} characters`,
  url: (v: string) => {
    if (!v) return "Field is required";
    // basic url check
    try {
      const u = new URL(v);
      return ["http:", "https:"].includes(u.protocol) || "Invalid URL";
    } catch {
      return "Invalid URL";
    }
  },
  date: (v: string) => {
    if (!v) return "Field is required";
    // very basic yyyy-mm-dd check
    const ok = /^\d{4}-\d{2}-\d{2}$/.test(v);
    return ok || "Invalid date (YYYY-MM-DD)";
  },
};

function resetForm() {
  form.value = {
    name: "",
    description: "",
    image: "",
    cost_per_launch: 0,
    country: "",
    first_flight: "",
    active: false,
  };
  if (formRef.value?.resetValidation) formRef.value.resetValidation();
}

function handleCancel() {
  resetForm();
  localOpen.value = false;
  emit("cancel");
}

// submit handler
async function handleSubmit() {
  // validate
  const valid = await (formRef.value?.validate
    ? formRef.value.validate()
    : isValid.value);
  if (!valid) return;

  submitting.value = true;

  const payload: RocketPayload = {
    name: String(form.value.name).trim(),
    description: String(form.value.description).trim(),
    image: String(form.value.image).trim(),
    cost_per_launch:
      typeof form.value.cost_per_launch === "number"
        ? form.value.cost_per_launch
        : Number(String(form.value.cost_per_launch).replace(/[^0-9.-]+/g, "")),
    country: String(form.value.country).trim(),
    first_flight: String(form.value.first_flight),
    active: form.value.active,
  };

  submitting.value = false;
  emit("submit", payload);

  // close and reset
  resetForm();
  localOpen.value = false;
}
</script>

<style scoped>
/* small helpers */
.v-card-text {
  padding-top: 0;
}

/* ensure date input visually fits */
input[type="date"] {
  padding: 12px 10px;
}
</style>
