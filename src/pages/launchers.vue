
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useLauncherStore } from '../stores/launcherStore'
import RocketCard from '../components/RocketCard.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

const router = useRouter()
const store = useLauncherStore()

const searchQuery = ref('')

const filteredLaunchers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return store.launchers
  }

  return store.launchers.filter((launcher) => {
    const name = launcher.name?.toLowerCase() ?? ''
    const fullName = launcher.full_name?.toLowerCase() ?? ''
    const manufacturer =
      launcher.manufacturer?.name?.toLowerCase() ?? ''

    return (
      name.includes(query) ||
      fullName.includes(query) ||
      manufacturer.includes(query)
    )
  })
})

const loading = computed(() => store.loading)
const error = computed(() => store.error ?? '')

async function fetchLaunchers() {
  await store.fetchLaunchers()
}

function openDetail(id: number) {
  router.push(`/launcher/${id}`)
}

function openAddRocket() {
  router.push('/launcher/add')
}

onMounted(() => {
  if (!store.hasFetched) {
    fetchLaunchers()
  }
})
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

        <span class="topbar-label">
          LAUNCH VEHICLES
        </span>
      </v-app-bar>

      <!-- Hero -->
      <section class="hero">
        <v-container class="py-12 py-md-16">
          <div class="text-center">
            <p class="eyebrow">EXPLORE THE UNIVERSE</p>

            <h1 class="hero-title">
              SpaceX Launchers
            </h1>

            <p class="description">
              Discover the launch vehicles powering humanity's
              journey to space.
            </p>

            <!-- Search -->
            <v-responsive max-width="520" class="mx-auto mt-8">
              <v-text-field
                v-model="searchQuery"
                label="Search launcher"
                placeholder="Search by name or manufacturer..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="comfortable"
                clearable
                hide-details
                rounded="lg"
              />
            </v-responsive>
          </div>
        </v-container>
      </section>

      <!-- Launcher List -->
      <v-container class="launcher-section py-8 py-md-12">
        <div
          class="d-flex flex-column flex-sm-row align-sm-end
                 justify-space-between ga-4 mb-7"
        >
          <div>
            <p class="eyebrow">THE FLEET</p>
            <h2 class="section-title">Launch Vehicles</h2>
          </div>

          <div class="d-flex align-center flex-wrap ga-3">
            <v-chip
              color="primary"
              variant="tonal"
              prepend-icon="mdi-rocket-launch"
            >
              {{ filteredLaunchers.length }} vehicles
            </v-chip>

            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              rounded="lg"
              to="/launcher/add"
            >
              Add Rocket
            </v-btn>
          </div>
        </div>

        <!-- Loading State -->
        <v-card
          v-if="loading"
          variant="outlined"
          rounded="xl"
          class="state-card pa-8"
        >
          <LoadingState message="Loading launchers..." />
        </v-card>

        <!-- Error State -->
        <v-card
          v-else-if="error"
          variant="outlined"
          rounded="xl"
          class="state-card pa-8"
        >
          <ErrorState
            title="Unable to load launchers"
            :message="error"
            @retry="fetchLaunchers"
          />
        </v-card>

        <!-- Empty State -->
        <v-card
          v-else-if="filteredLaunchers.length === 0"
          variant="outlined"
          rounded="xl"
          class="state-card pa-10 text-center"
        >
          <v-icon
            icon="mdi-rocket-outline"
            size="56"
            color="medium-emphasis"
            class="mb-4"
          />

          <h3 class="text-h6 font-weight-bold">
            No launchers found
          </h3>

          <p class="text-body-2 text-medium-emphasis mt-2">
            {{
              searchQuery
                ? 'Try searching with another name.'
                : 'No launchers are available right now.'
            }}
          </p>

          <v-btn
            v-if="searchQuery"
            class="mt-4"
            variant="tonal"
            color="primary"
            @click="searchQuery = ''"
          >
            Clear Search
          </v-btn>
        </v-card>

        <!-- Rocket Cards -->
        <v-row v-else>
          <v-col
            v-for="launcher in filteredLaunchers"
            :key="launcher.id"
            cols="12"
            sm="6"
            lg="4"
          >
            <RocketCard
              :launcher="launcher"
              @view-details="openDetail"
            />
          </v-col>
        </v-row>
      </v-container>

      <!-- Footer -->
      <v-footer class="footer px-4 px-md-10 py-6">
        <v-container class="d-flex flex-column flex-sm-row
                            justify-space-between ga-3 pa-0">
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
  color: #ffffff;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 2px;
  text-decoration: none;
}

.brand span,
.footer-brand span {
  color: #80aaff;
}

.topbar-label {
  color: #8c98ad;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.hero {
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

.hero-title {
  margin: 16px 0;
  color: #f4f6fa;
  font-size: clamp(36px, 6vw, 60px);
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.15;
}

.description {
  max-width: 600px;
  margin: 0 auto;
  color: #a1aabd;
  font-size: 15px;
  line-height: 1.8;
}

.launcher-section {
  max-width: 1230px;
  min-height: 350px;
}

.section-title {
  margin-top: 10px;
  color: #f4f6fa;
  font-size: 28px;
  font-weight: 700;
}

.state-card {
  background: #111621;
  border-color: #252d3c;
}

.footer {
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

@media (max-width: 600px) {
  .topbar-label {
    font-size: 9px;
  }

  .hero-title {
    letter-spacing: -1px;
  }

  .section-title {
    font-size: 23px;
  }
}
</style>
