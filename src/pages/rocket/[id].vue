<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'

import {
  useRoute,
} from 'vue-router'

import SafeImage
  from '@/components/common/SafeImage.vue'

import {
  getRocketById,
} from '@/services/rocketService'

import {
  useRocketStore,
} from '@/stores/rocketStore'

import {
  formatDate,
  formatLaunchCost,
  textOrFallback,
} from '@/utils/rocketFormat'

import type {
  Rocket,
} from '@/types/rocket'


const route =
  useRoute()


const {
  findLocalRocket,
} = useRocketStore()


const rocket =
  ref<Rocket | null>(null)

const loading =
  ref(false)

const error =
  ref('')


function getRouteId() {
  const id =
    route.params.id

  if (
    Array.isArray(id)
  ) {
    return String(id[0])
  }

  return String(id)
}


async function loadRocket() {
  const id =
    getRouteId()

  loading.value = true
  error.value = ''
  rocket.value = null


  const localRocket =
    findLocalRocket(id)


  if (localRocket) {
    rocket.value =
      localRocket

    loading.value =
      false

    return
  }


  if (
    id.startsWith('local-')
  ) {
    error.value =
      'This locally added rocket is no longer available. Local rockets only exist while the application is running.'

    loading.value =
      false

    return
  }


  try {
    rocket.value =
      await getRocketById(id)
  }
  catch (caughtError) {
    error.value =
      caughtError instanceof Error
        ? caughtError.message
        : 'Something went wrong.'
  }
  finally {
    loading.value =
      false
  }
}


onMounted(() => {
  loadRocket()
})
</script>


<template>
  <main class="page">

    <RouterLink
      class="back-link"
      to="/"
    >
      ← Back to Rockets
    </RouterLink>


    <div
      v-if="loading"
      class="status"
    >
      Loading rocket detail...
    </div>


    <div
      v-else-if="error"
      class="error-state"
    >

      <h2>
        Failed to load rocket
      </h2>

      <p>
        {{ error }}
      </p>


      <button
        type="button"

        @click="
          loadRocket
        "
      >
        Retry
      </button>

    </div>


    <article
      v-else-if="rocket"
      class="rocket-detail"
    >

      <div class="rocket-image">

      <SafeImage
    :src="rocket.image_url"
    :alt="rocket.full_name || 'Rocket image'"
        />
      </div>

      <div class="rocket-information">

        <span
          v-if="rocket.isLocal"
          class="local-badge"
        >
          Local rocket
        </span>


        <h1>
          {{
            textOrFallback(
              rocket.full_name,
              'Unnamed rocket',
            )
          }}
        </h1>


        <p class="description">
          {{
            textOrFallback(
              rocket.description,
              'Description not available.',
            )
          }}
        </p>


        <dl class="specifications">

          <div>
            <dt>
              Cost per launch
            </dt>

            <dd>
              {{
                formatLaunchCost(
                  rocket.launch_cost
                )
              }}
            </dd>
          </div>


          <div>
            <dt>
              Country
            </dt>

            <dd>
              {{
                textOrFallback(
                  rocket.manufacturer
                    ?.country_code
                )
              }}
            </dd>
          </div>


          <div>
            <dt>
              First flight
            </dt>

            <dd>
              {{
                formatDate(
                  rocket.maiden_flight
                )
              }}
            </dd>
          </div>

        </dl>

      </div>

    </article>

  </main>
</template>

<style scoped
  src="@/pages/rocket/[id].css"
></style>
