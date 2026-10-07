<template>
  <v-dialog
    v-model="dialog"
    max-width="650px"
    transition="dialog-bottom-transition"
  >
    <template #activator="{ props }">
      <v-btn
        color="cyan-accent-3"
        variant="outlined"
        prepend-icon="mdi-plus-network"
        v-bind="props"
        size="large"
        class="cyber-trigger-btn"
      >
        ADD MORE TROOPS!
      </v-btn>
    </template>

    <v-card class="cyber-dialog">
      <div class="dialog-grid-bg" />

      <v-card-title
        class="dialog-header py-4 px-6 d-flex justify-space-between align-center"
      >
        <div class="d-flex align-center">
          <span class="status-dot blink-anim mr-3" />
          <span
            class="text-h6 font-weight-bold text-cyan-accent-3 font-space-mono text-glow"
          >
            REGISTER NEW VEHICLE
          </span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          color="cyan-accent-3"
          class="hover-rotate"
          @click="close"
        />
      </v-card-title>

      <v-card-text class="pa-6 position-relative z-index-2">
        <v-form
          ref="formRef"
          v-model="isValid"
          @submit.prevent="submit"
        >
          <v-container class="pa-0">
            <v-row>
              <v-col
                cols="12"
                sm="6"
                class="pb-2"
              >
                <v-text-field
                  v-model="form.name"
                  label="Designation (Class)"
                  required
                  :rules="[(v) => !!v || 'Designation is required']"
                  variant="outlined"
                  density="comfortable"
                  class="cyber-field"
                  base-color="rgba(0, 229, 255, 0.3)"
                  color="cyan-accent-3"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                class="pb-2"
              >
                <v-text-field
                  v-model="form.full_name"
                  label="Full Name"
                  required
                  :rules="[(v) => !!v || 'Full Name is required']"
                  variant="outlined"
                  density="comfortable"
                  class="cyber-field"
                  base-color="rgba(0, 229, 255, 0.3)"
                  color="cyan-accent-3"
                />
              </v-col>
              <v-col
                cols="12"
                class="pb-2"
              >
                <v-textarea
                  v-model="form.description"
                  label="Telemetry & Description"
                  required
                  :rules="[(v) => !!v || 'Description is required']"
                  variant="outlined"
                  rows="3"
                  auto-grow
                  density="comfortable"
                  class="cyber-field"
                  base-color="rgba(0, 229, 255, 0.3)"
                  color="cyan-accent-3"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                class="pb-2"
              >
                <v-text-field
                  v-model="form.launch_cost"
                  label="Launch Cost (Optional)"
                  prefix="$"
                  variant="outlined"
                  density="comfortable"
                  class="cyber-field"
                  base-color="rgba(0, 229, 255, 0.3)"
                  color="cyan-accent-3"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                class="pb-2"
              >
                <v-text-field
                  v-model="form.maiden_flight"
                  label="Maiden Flight (Optional)"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                  class="cyber-field"
                  base-color="rgba(0, 229, 255, 0.3)"
                  color="cyan-accent-3"
                />
              </v-col>
              <v-col
                cols="12"
                class="pb-2"
              >
                <v-text-field
                  v-model="form.image_url"
                  label="Image Blueprint URL (Optional)"
                  variant="outlined"
                  density="comfortable"
                  class="cyber-field"
                  prepend-inner-icon="mdi-link-variant"
                  base-color="rgba(0, 229, 255, 0.3)"
                  color="cyan-accent-3"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider color="rgba(0, 229, 255, 0.2)" />

      <v-card-actions class="pa-4 dialog-footer">
        <v-spacer />
        <v-btn
          color="grey-lighten-1"
          variant="text"
          class="font-space-mono px-4 cancel-btn"
          @click="close"
        >
          ABORT
        </v-btn>
        <v-btn
          color="cyan-accent-4"
          variant="flat"
          :disabled="!isValid"
          class="px-6 font-space-mono font-weight-bold submit-btn"
          @click="submit"
        >
          <v-icon
            start
            icon="mdi-database-arrow-up"
          />
          DEPLOY
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Rocket } from "../../types/rocket";

const emit = defineEmits(["add"]);
const dialog = ref(false);
const isValid = ref(false);
const formRef = ref<unknown>(null);

const form = ref({
  name: "",
  full_name: "",
  description: "",
  launch_cost: "",
  maiden_flight: "",
  image_url: "",
});

const close = () => {
  dialog.value = false;
  if (formRef.value) (formRef.value as { reset: () => void }).reset();
};

const submit = () => {
  if (isValid.value) {
    const newRocket: Rocket = {
      id: Date.now().toString(), // Generate local ID
      url: "",
      name: form.value.name,
      full_name: form.value.full_name,
      description: form.value.description,
      launch_cost: form.value.launch_cost || null,
      maiden_flight: form.value.maiden_flight || null,
      image_url: form.value.image_url || null,
      manufacturer: { country_code: "Local" },
    };
    emit("add", newRocket);
    close();
  }
};
</script>

<style scoped>
/* Button Activator */
.cyber-trigger-btn {
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.4) !important;
  font-family: "Space Mono", monospace;
  letter-spacing: 0.1em;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.1);
  transition: all 0.3s ease;
}

.cyber-trigger-btn:hover {
  background: rgba(0, 229, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
  transform: translateY(-2px);
}

/* Dialog Container */
.cyber-dialog {
  background: rgba(10, 14, 23, 0.85) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 0 40px rgba(0, 0, 0, 0.8),
    inset 0 0 20px rgba(0, 229, 255, 0.05);
}

.dialog-grid-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 0;
  pointer-events: none;
}

.dialog-header {
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  background: linear-gradient(to right, rgba(0, 229, 255, 0.1), transparent);
}

.font-space-mono {
  font-family: "Space Mono", monospace !important;
}

.text-glow {
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  letter-spacing: 0.05em;
}

.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #00e5ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00e5ff;
}

.blink-anim {
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.hover-rotate {
  transition: transform 0.3s ease;
}
.hover-rotate:hover {
  transform: rotate(90deg);
}

/* Form Fields Styling */
.cyber-field :deep(.v-field) {
  background: rgba(0, 0, 0, 0.3) !important;
  color: #ffffff;
}

.cyber-field :deep(input),
.cyber-field :deep(textarea) {
  color: #ffffff !important;
  font-family: "Space Mono", monospace;
  font-size: 0.9rem;
}

.cyber-field :deep(.v-label) {
  color: rgba(0, 229, 255, 0.7);
  font-family: "Space Mono", monospace;
}

/* Chrome/Webkit Autofill fix for dark themes */
.cyber-field :deep(input:-webkit-autofill) {
  -webkit-box-shadow: 0 0 0 30px #060913 inset !important;
  -webkit-text-fill-color: white !important;
}

/* Footer Buttons */
.dialog-footer {
  background: rgba(0, 0, 0, 0.4);
}

.cancel-btn:hover {
  color: #ff5252 !important;
  background: rgba(255, 82, 82, 0.1);
}

.submit-btn {
  background: linear-gradient(45deg, #00b8d4, #00e5ff) !important;
  color: #000000 !important;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
}

.submit-btn:not(:disabled):hover {
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.6) !important;
  transform: translateY(-2px);
}
</style>
