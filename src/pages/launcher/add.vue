
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useLauncherStore } from '../../stores/launcherStore'
import Snackbar from '../../components/Snackbar.vue'

const router = useRouter()
const store = useLauncherStore()

const name = ref('')
const fullName = ref('')
const description = ref('')
const imageUrl = ref('')
const launchCost = ref<string | number>('')
const countryCode = ref('')
const maidenFlight = ref('')

const errors = ref<Record<string, string>>({})
const submitting = ref(false)

const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarType = ref<'success' | 'error'>('success')
const imagePreviewError = ref(false)

function notify(message: string, type: 'success' | 'error' = 'success') {
  snackbarMessage.value = message
  snackbarType.value = type
  showSnackbar.value = true
}

function validateForm(): boolean {
  const newErrors: Record<string, string> = {}

  if (!name.value.trim()) {
    newErrors.name = 'Rocket name is required.'
  }

  const url = imageUrl.value.trim()

  if (url && !/^https?:\/\/.+/i.test(url)) {
    newErrors.imageUrl = 'Enter a valid HTTP or HTTPS image URL.'
  }

  const cost = String(launchCost.value).trim()

  if (cost !== '') {
    const numericCost = Number(cost)

    if (!Number.isFinite(numericCost) || numericCost < 0) {
      newErrors.launchCost = 'Launch cost must be a non-negative number.'
    }
  }

  const now = new Date()
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')

  if (maidenFlight.value && maidenFlight.value > today) {
    newErrors.maidenFlight = 'First flight date cannot be in the future.'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

async function saveRocket() {
  if (submitting.value || !validateForm()) return

  submitting.value = true

  try {
    const cost = String(launchCost.value).trim()

    store.addLauncher({
      name: name.value.trim(),
      full_name: fullName.value.trim() || undefined,
      description: description.value.trim() || null,
      image_url: imageUrl.value.trim() || null,
      launch_cost: cost === '' ? null : Number(cost),
      maiden_flight: maidenFlight.value || null,
      manufacturer: {
        name: 'Custom',
        country_code: countryCode.value.trim().toUpperCase() || undefined,
      },
    })

    notify('Rocket added successfully!', 'success')

    await new Promise((resolve) => setTimeout(resolve, 1500))
    await router.push('/launchers')
  } catch (error) {
    console.error('Failed to save rocket:', error)
    notify('Failed to add rocket. Please try again.', 'error')
    errors.value = { form: 'Failed to save rocket. Please try again.' }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <v-main class="page">
    <Snackbar
      v-model="showSnackbar"
      :message="snackbarMessage"
      :type="snackbarType"
    />

    <!-- Navigation -->
    <v-app-bar color="#080b12" flat border="b">
      <v-container class="d-flex align-center justify-space-between">
        <RouterLink to="/" class="brand">
          SPACE<span>X</span>
        </RouterLink>

        <v-btn
          to="/launchers"
          variant="text"
          color="blue-lighten-2"
          prepend-icon="mdi-arrow-left"
          size="small"
        >
          Back to Launch Vehicles
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Hero -->
    <section class="hero">
      <p class="eyebrow">EXPAND THE FLEET</p>
      <h1>Add New Rocket</h1>
      <p class="hero-description">
        Add a new launch vehicle to your local collection.
      </p>
    </section>

    <!-- Form -->
    <v-container class="form-section">
      <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-6">
        <div>
          <p class="eyebrow">ROCKET CONFIGURATION</p>
          <h2 class="section-title">Rocket Information</h2>
        </div>

        <v-chip
          color="blue-lighten-2"
          variant="tonal"
          prepend-icon="mdi-database-outline"
        >
          Local entry
        </v-chip>
      </div>

      <v-card class="form-card" rounded="lg" variant="outlined">
        <v-card-text class="pa-5 pa-md-7">
          <v-alert
            v-if="errors.form"
            type="error"
            variant="tonal"
            density="comfortable"
            class="mb-5"
          >
            {{ errors.form }}
          </v-alert>

          <form @submit.prevent="saveRocket">
            <v-text-field
              id="name"
              v-model="name"
              label="Rocket Name *"
              placeholder="e.g. Falcon Heavy"
              prepend-inner-icon="mdi-rocket-launch"
              :error-messages="errors.name"
              maxlength="100"
              required
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              id="fullName"
              v-model="fullName"
              label="Full Name"
              placeholder="e.g. Falcon Heavy Launch Vehicle"
              prepend-inner-icon="mdi-card-text-outline"
              maxlength="150"
              variant="outlined"
              class="mb-2"
            />

            <v-textarea
              id="description"
              v-model="description"
              label="Description"
              placeholder="Describe this launch vehicle..."
              prepend-inner-icon="mdi-text"
              rows="4"
              maxlength="2000"
              auto-grow
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              id="imageUrl"
              v-model="imageUrl"
              label="Image URL"
              placeholder="https://example.com/rocket.jpg"
              prepend-inner-icon="mdi-image-outline"
              :error-messages="errors.imageUrl"
              type="url"
              variant="outlined"
              class="mb-2"
              @update:model-value="imagePreviewError = false"
            />

            <!-- Image preview -->
            <v-card
              v-if="imageUrl.trim()"
              class="image-preview mb-5"
              variant="outlined"
            >
              <v-card-title class="text-caption">
                IMAGE PREVIEW
              </v-card-title>

              <v-img
                v-if="!imagePreviewError"
                :src="imageUrl.trim()"
                :alt="name || 'Rocket preview'"
                height="240"
                contain
                @error="imagePreviewError = true"
              />

              <v-alert
                v-else
                type="warning"
                variant="tonal"
                density="compact"
                class="ma-3"
              >
                Image could not be loaded. Please check the URL.
              </v-alert>
            </v-card>

            <v-text-field
              id="launchCost"
              v-model="launchCost"
              label="Launch Cost (USD)"
              placeholder="90000000"
              prepend-inner-icon="mdi-currency-usd"
              :error-messages="errors.launchCost"
              type="number"
              min="0"
              step="any"
              variant="outlined"
              class="mb-2"
            />

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  id="countryCode"
                  v-model="countryCode"
                  label="Country Code"
                  placeholder="US"
                  prepend-inner-icon="mdi-earth"
                  maxlength="3"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  id="maidenFlight"
                  v-model="maidenFlight"
                  label="First Flight"
                  prepend-inner-icon="mdi-calendar"
                  :error-messages="errors.maidenFlight"
                  type="date"
                  :max="new Date().getFullYear() + '-' +
                    String(new Date().getMonth() + 1).padStart(2, '0') + '-' +
                    String(new Date().getDate()).padStart(2, '0')"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <!-- Actions -->
            <div class="d-flex justify-end flex-wrap ga-3 mt-4">
              <v-btn
                to="/launchers"
                variant="outlined"
                color="grey-lighten-1"
                prepend-icon="mdi-close"
                :disabled="submitting"
              >
                Cancel
              </v-btn>

              <v-btn
                type="submit"
                color="blue-lighten-2"
                prepend-icon="mdi-content-save"
                append-icon="mdi-arrow-right"
                :loading="submitting"
                :disabled="submitting"
              >
                Save Rocket
              </v-btn>
            </div>

            <v-alert
              class="mt-5"
              type="info"
              variant="tonal"
              density="compact"
            >
              * Required field. New rockets are stored locally in this app
              session and are not sent to the Space Devs API.
            </v-alert>
          </form>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Footer -->
    <v-footer class="footer">
      <v-container class="d-flex justify-space-between align-center flex-wrap ga-3">
        <p class="footer-brand">SPACE<span>X</span> EXPLORER</p>
        <p class="footer-description">Launch vehicles · Space exploration</p>
      </v-container>
    </v-footer>
  </v-main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #080b12;
  color: #f4f6fa;
  font-family: Inter, Arial, sans-serif;
}

.brand {
  color: #fff;
  font-size: 23px;
  font-weight: 900;
  letter-spacing: 2px;
  text-decoration: none;
}

.brand span,
.footer-brand span {
  color: #80aaff;
}

.hero {
  padding: 65px 20px 45px;
  text-align: center;
  background: radial-gradient(
    ellipse at top,
    #19263e 0%,
    transparent 65%
  );
}

.eyebrow {
  margin: 0;
  color: #8c98ad;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.hero h1 {
  margin: 16px 0;
  font-size: clamp(34px, 5vw, 52px);
  font-weight: 800;
  letter-spacing: -1.5px;
}

.hero-description {
  color: #a1aabd;
  line-height: 1.7;
}

.form-section {
  max-width: 800px;
  padding-bottom: 72px;
}

.section-title {
  margin-top: 10px;
  font-size: 25px;
  font-weight: 700;
}

.form-card,
.image-preview {
  background: #111621;
  border-color: #30394b;
}

.image-preview {
  overflow: hidden;
}

.footer {
  background: #080b12;
  border-top: 1px solid #252a35;
  color: #8c98ad;
}

.footer-brand {
  margin: 0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}

.footer-description {
  margin: 0;
  font-size: 12px;
}

@media (max-width: 600px) {
  .hero {
    padding: 48px 20px 36px;
  }

  .section-title {
    font-size: 21px;
  }
}
</style>
