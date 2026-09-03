export {}

declare module 'vue' {
  export interface GlobalComponents {
    AddRocketDialog: typeof import('./src/components/AddRocketDialog.vue')['default']
    AppNavbar: typeof import('./src/components/AppNavbar.vue')['default']
    ErrorState: typeof import('./src/components/ErrorState.vue')['default']
    LoadingState: typeof import('./src/components/LoadingState.vue')['default']
    RocketCard: typeof import('./src/components/RocketCard.vue')['default']
    RocketDetailHeader: typeof import('./src/components/RocketDetailHeader.vue')['default']
    RocketFilter: typeof import('./src/components/RocketFilter.vue')['default']
    RocketHeroImage: typeof import('./src/components/RocketHeroImage.vue')['default']
    RocketSpecsTable: typeof import('./src/components/RocketSpecsTable.vue')['default']
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
  }
}
