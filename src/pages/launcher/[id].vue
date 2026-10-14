
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { getLauncherById } from '../../services/launcherApi'
import type { Launcher } from '../../services/launcherApi'
import { useLauncherStore } from '../../stores/launcherStore'
import ImageModal from '../../components/ImageModal.vue'
import LoadingState from '../../components/LoadingState.vue'
import ErrorState from '../../components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const store = useLauncherStore()

const launcher = ref<Launcher | null>(null)
const loading = ref(true)
const error = ref('')
const imageError = ref(false)
const additionalImageError = ref(false)
const imageModalOpen = ref(false)

async function fetchLauncher() {
  loading.value = true
  error.value = ''
  launcher.value = null
  imageError.value = false
  additionalImageError.value = false
  imageModalOpen.value = false

  const id = route.params.id

  if (!id || Array.isArray(id) || !/^\d+$/.test(id)) {
    error.value = 'Invalid launcher ID.'
    loading.value = false
    return
  }

  const numericId = Number(id)

  try {
    await store.fetchLaunchers()

    const customRocket = store.launchers.find(
      (rocket) =>
        rocket.id === numericId &&
        rocket.isCustom === true,
    )

    if (customRocket) {
      launcher.value = customRocket
    } else {
      launcher.value = await getLauncherById(numericId)
    }
  } catch (err) {
    console.error('Failed to fetch launcher:', err)
    error.value = 'Failed to load launcher. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchLauncher)

watch(() => route.params.id, fetchLauncher)

function goBack() {
  router.push('/launchers')
}

function formatLaunchCost(
  cost: number | null | undefined,
): string {
  if (cost == null) return 'Not available'

  return `$${cost.toLocaleString('en-US')}`
}

function openImageModal() {
  if (launcher.value?.image_url && !additionalImageError.value) {
    imageModalOpen.value = true
  }
}
</script>

<template>
  <v-app>
    <v-main class="page">
      <!-- Header -->
      <v-app-bar
        flat
        color="surface"
        class="topbar px-4 px-md-10"
      >
        <RouterLink to="/" class="brand">
          SPACE<span>X</span>
        </RouterLink>

        <v-spacer />

        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          to="/launchers"
          color="primary"
          rounded="lg"
        >
          Back to Launchers
        </v-btn>
      </v-app-bar>

      <!-- Loading -->
      <v-container v-if="loading" class="py-12">
        <LoadingState message="Loading launcher details..." />
      </v-container>

      <!-- Error -->
      <v-container v-else-if="error" class="py-12">
        <v-card
          class="state-card pa-6 pa-md-10"
          variant="outlined"
          rounded="xl"
        >
          <ErrorState
            title="Unable to load launcher"
            :message="error"
            @retry="fetchLauncher"
          />
        </v-card>
      </v-container>

      <!-- Rocket Detail -->
      <v-container
        v-else-if="launcher"
        class="detail-container py-6 py-md-10"
      >
        <!-- Hero -->
        <v-card
          class="hero-card"
          rounded="xl"
          variant="outlined"
        >
          <v-img
            v-if="launcher.image_url && !imageError"
            :src="launcher.image_url"
            :alt="
              launcher.full_name ||
              launcher.name ||
              'Rocket image'
            "
            height="400"
            cover
            class="hero-image"
            @error="imageError = true"
          >
            <div class="hero-overlay">
              <div class="hero-content">
                <v-chip
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-rocket-launch"
                  class="mb-4"
                >
                  {{
                    launcher.manufacturer?.name || 'SpaceX'
                  }}
                  · LAUNCH VEHICLE
                </v-chip>

                <h1 class="hero-title">
                  {{
                    launcher.full_name ||
                    launcher.name ||
                    'Unnamed Rocket'
                  }}
                </h1>

                <p class="hero-description">
                  Explore the specifications and technical
                  information of this launch vehicle.
                </p>
              </div>
            </div>
          </v-img>

          <div
            v-else
            class="hero-fallback d-flex flex-column
                   align-center justify-center pa-8"
          >
            <v-icon
              icon="mdi-rocket-launch"
              size="64"
              color="primary"
              class="mb-4"
            />

            <p class="eyebrow">
              {{
                launcher.manufacturer?.name || 'SpaceX'
              }}
              · LAUNCH VEHICLE
            </p>

            <h1 class="hero-title text-center mt-3">
              {{
                launcher.full_name ||
                launcher.name ||
                'Unnamed Rocket'
              }}
            </h1>

            <p class="text-medium-emphasis mt-3">
              No image available
            </p>
          </div>
        </v-card>

        <!-- Overview and Key Information -->
        <v-row class="mt-5">
          <!-- Overview -->
          <v-col cols="12" md="7">
            <v-card
              class="detail-card pa-5 pa-md-7 h-100"
              variant="outlined"
              rounded="xl"
            >
              <p class="eyebrow">OVERVIEW</p>

              <h2 class="section-title mt-2 mb-4">
                About the launcher
              </h2>

              <p class="description">
                {{
                  launcher.description ||
                  'No description available.'
                }}
              </p>

              <!-- Additional Image -->
              <div class="mt-8">
                <p class="eyebrow mb-3">ROCKET IMAGE</p>

                <v-card
                  v-if="
                    launcher.image_url &&
                    !additionalImageError
                  "
                  class="image-card"
                  variant="outlined"
                  rounded="lg"
                  @click="openImageModal"
                  @keydown.enter="openImageModal"
                  @keydown.space.prevent="openImageModal"
                  tabindex="0"
                  role="button"
                  aria-label="View larger rocket image"
                >
                  <v-img
                    :src="launcher.image_url"
                    :alt="
                      (launcher.full_name ||
                        launcher.name ||
                        'Rocket') + ' image'
                    "
                    height="300"
                    contain
                    @error="additionalImageError = true"
                  >
                    <div class="image-action">
                      <v-chip
                        color="surface"
                        prepend-icon="mdi-magnify-plus-outline"
                        size="small"
                      >
                        View larger
                      </v-chip>
                    </div>
                  </v-img>
                </v-card>

                <v-card
                  v-else
                  class="image-placeholder pa-8 text-center"
                  variant="outlined"
                  rounded="lg"
                >
                  <v-icon
                    icon="mdi-image-off-outline"
                    size="48"
                    color="medium-emphasis"
                  />

                  <p class="text-medium-emphasis mt-3">
                    No image available
                  </p>
                </v-card>
              </div>
            </v-card>
          </v-col>

          <!-- Key Information -->
          <v-col cols="12" md="5">
            <v-card
              class="detail-card pa-5 pa-md-7"
              variant="outlined"
              rounded="xl"
            >
              <p class="eyebrow">KEY INFORMATION</p>

              <h2 class="section-title mt-2 mb-4">
                Specifications
              </h2>

              <v-list
                bg-color="transparent"
                class="info-list pa-0"
              >
                <v-list-item class="info-item px-0">
                  <v-list-item-title class="info-label">
                    Rocket name
                  </v-list-item-title>

                  <v-list-item-subtitle class="info-value">
                    {{
                      launcher.full_name ||
                      launcher.name ||
                      'Not available'
                    }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="info-item px-0">
                  <v-list-item-title class="info-label">
                    Manufacturer
                  </v-list-item-title>

                  <v-list-item-subtitle class="info-value">
                    {{
                      launcher.manufacturer?.name ||
                      'Not available'
                    }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="info-item px-0">
                  <v-list-item-title class="info-label">
                    Country
                  </v-list-item-title>

                  <v-list-item-subtitle class="info-value">
                    {{
                      launcher.manufacturer?.country_code ||
                      'Not available'
                    }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="info-item px-0">
                  <v-list-item-title class="info-label">
                    First flight
                  </v-list-item-title>

                  <v-list-item-subtitle class="info-value">
                    {{
                      launcher.maiden_flight ||
                      'Not available'
                    }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="info-item px-0">
                  <v-list-item-title class="info-label">
                    Cost per launch
                  </v-list-item-title>

                  <v-list-item-subtitle
                    class="info-value cost-value"
                  >
                    {{ formatLaunchCost(launcher.launch_cost) }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-btn
                block
                color="primary"
                variant="flat"
                prepend-icon="mdi-arrow-left"
                rounded="lg"
                class="mt-6"
                @click="goBack"
              >
                Back to launcher list
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Not Found -->
      <v-container v-else class="py-12">
        <v-card
          class="state-card pa-8 text-center"
          variant="outlined"
          rounded="xl"
        >
          <v-icon
            icon="mdi-rocket-launch-outline"
            size="56"
            color="primary"
          />

          <p class="eyebrow mt-4">404 / NOT FOUND</p>

          <h1 class="section-title mt-2">
            Launcher not found
          </h1>

          <p class="text-medium-emphasis mt-3">
            The requested launcher could not be found.
          </p>

          <v-btn
            class="mt-5"
            color="primary"
            prepend-icon="mdi-arrow-left"
            rounded="lg"
            @click="goBack"
          >
            Return to launcher list
          </v-btn>
        </v-card>
      </v-container>

      <!-- Image Modal -->
      <ImageModal
        :open="imageModalOpen"
        :title="
          launcher?.full_name ||
          launcher?.name ||
          'Rocket image'
        "
        @close="imageModalOpen = false"
      >
        <img
          v-if="
            launcher?.image_url &&
            !additionalImageError
          "
          :src="launcher.image_url"
          :alt="
            launcher.full_name ||
            launcher.name ||
            'Rocket image'
          "
          class="modal-image"
          @error="additionalImageError = true"
        />

        <p v-else class="text-medium-emphasis text-center pa-6">
          Gambar roket tidak tersedia.
        </p>
      </ImageModal>

      <!-- Footer -->
      <v-footer class="footer px-4 px-md-10 py-6">
        <v-container
          class="d-flex flex-column flex-sm-row
                 justify-space-between ga-3 pa-0"
        >
          <p class="footer-brand">
            SPACE<span>X</span> EXPLORER
          </p>

          <p class="footer-caption">
            Launch vehicles · Space exploration
          </p>
        </v-container>
      </v-footer>
    </v-main>
  </v-app>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #080b12;
  color: #f4f6fa;
}

.topbar {
  border-bottom: 1px solid #252a35;
}

.brand {
  color: #fff;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 2px;
  text-decoration: none;
}

.brand span,
.footer-brand span {
  color: #80aaff;
}

.detail-container {
  max-width: 1230px;
  min-height: 65vh;
}

.hero-card,
.detail-card,
.state-card {
  overflow: hidden;
  background: #111621;
  border-color: #252d3c;
}

.hero-image {
  background: #151b29;
}

.hero-overlay {
  display: flex;
  align-items: end;
  width: 100%;
  height: 100%;
  padding: 32px;
  background: linear-gradient(
    90deg,
    rgb(8 11 18 / 94%) 0%,
    rgb(8 11 18 / 76%) 48%,
    rgb(8 11 18 / 25%) 100%
  );
}

.hero-content {
  max-width: 720px;
}

.hero-title {
  color: #f4f6fa;
  font-size: clamp(34px, 5vw, 60px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -1.5px;
  overflow-wrap: anywhere;
}

.hero-description {
  max-width: 480px;
  margin-top: 16px;
  color: #c1c9d8;
  font-size: 14px;
  line-height: 1.8;
}

.hero-fallback {
  min-height: 400px;
  background: radial-gradient(
    ellipse at top,
    #19263e 0%,
    #111621 75%
  );
}

.eyebrow {
  margin: 0;
  color: #91b2f1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 1.8;
  overflow-wrap: anywhere;
}

.section-title {
  color: #f4f6fa;
  font-size: 25px;
  font-weight: 700;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.description {
  color: #a1aabd;
  font-size: 15px;
  line-height: 1.9;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.image-card {
  overflow: hidden;
  background: #080b12;
  border-color: #30394b;
  cursor: zoom-in;
}

.image-card:focus-visible {
  outline: 2px solid #80aaff;
  outline-offset: 3px;
}

.image-action {
  display: flex;
  align-items: end;
  justify-content: end;
  width: 100%;
  height: 100%;
  padding: 12px;
  background: linear-gradient(
    transparent 65%,
    rgb(8 11 18 / 55%)
  );
}

.image-placeholder {
  min-height: 200px;
  background: #080b12;
  border-color: #30394b;
}

.info-list {
  color: #f4f6fa;
}

.info-item {
  min-height: auto;
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #293140;
}

.info-label {
  margin-bottom: 8px;
  color: #9ba6ba;
  font-size: 12px;
  opacity: 1;
}

.info-value {
  color: #f4f6fa;
  font-size: 14px;
  line-height: 1.7;
  opacity: 1;
  overflow-wrap: anywhere;
}

.cost-value {
  color: #a8c4ff;
}

.footer {
  margin-top: 16px;
  background: #0b101a;
  border-top: 1px solid #252a35;
}

.footer-brand {
  margin: 0;
  color: #f4f6fa;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}

.footer-caption {
  margin: 0;
  color: #8c98ad;
  font-size: 12px;
}

.modal-image {
  display: block;
  max-width: 100%;
  max-height: 75vh;
  margin: auto;
  object-fit: contain;
}

@media (max-width: 600px) {
  .hero-overlay {
    padding: 22px;
    background: linear-gradient(
      0deg,
      rgb(8 11 18 / 96%) 0%,
      rgb(8 11 18 / 45%) 100%
    );
  }

  .hero-title {
    font-size: 34px;
    letter-spacing: -1px;
  }

  .hero-fallback {
    min-height: 300px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
