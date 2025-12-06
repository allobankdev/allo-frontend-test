<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-card
          v-for="item in communities"
          :key="item.id"
          class="community-card mb-4"
          rounded="xl"
          @click="openModal"
        >
          <v-row no-gutters class="pa-4" align="center">
            <!-- Avatar / Icon -->
            <v-col cols="2" class="d-flex justify-center">
              <v-avatar size="100">
                <v-img :src="item.icon" cover />
              </v-avatar>
            </v-col>

            <!-- Text -->
            <v-col cols="8">
              <div class="text-subtitle-1 font-weight-medium text-white">
                {{ item.title }}
              </div>

              <div
                class="text-caption d-flex align-center text-grey-lighten-1 mt-1"
              >
                <v-icon size="16" class="mr-1">mdi-account-multiple</v-icon>
                {{ item.members }} Members
              </div>

              <div class="text-body-2 text-grey-lighten-1 mt-2">
                {{ item.description }}
              </div>
            </v-col>

            <!-- Public Badge -->
            <v-col cols="2" class="d-flex justify-end">
              <v-chip size="small" class="public-chip" prepend-icon="mdi-eye">
                Public
              </v-chip>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['open-modal'])

interface Community {
  id: number;
  title: string;
  members: number;
  description: string;
  icon: string;
}

const communities: Community[] = [
  {
    id: 1,
    title: "Name of Community",
    members: 453,
    description:
      "From cozy cafes to casual meet-ups, this community is united by the love for coffee.",
    icon: "https://picsum.photos/60?random=1",
  },
  {
    id: 2,
    title: "Fadel - Powlowski",
    members: 453,
    description:
      "From cozy cafes to casual meet-ups, this community is united by the love for coffee.",
    icon: "https://picsum.photos/60?random=2",
  },
  {
    id: 3,
    title: "Erdman - Terry",
    members: 453,
    description:
      "From cozy cafes to casual meet-ups, this community is united by the love for coffee.",
    icon: "https://picsum.photos/60?random=3",
  },
  {
    id: 4,
    title: "Grant, Beer and Senger",
    members: 453,
    description:
      "From cozy cafes to casual meet-ups, this community is united by the love for coffee.",
    icon: "https://picsum.photos/60?random=4",
  },
];

const openModal = () => {
    emit("open-modal", true);
}
</script>

<style scoped>
.community-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  transition: 0.25s ease;
}

.community-card:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
}

.public-chip {
  background: rgba(255, 255, 255, 0.07) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
</style>
