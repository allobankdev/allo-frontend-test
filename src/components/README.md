# Components

All components in this directory are imported explicitly in each SFC that uses them.

## Usage

```vue
<template>
  <div>
    <MyComponent />
  </div>
</template>

<script lang="ts" setup>
import MyComponent from '@/components/MyComponent.vue'
</script>
```

## Components

| File                  | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `AppHeader.vue`       | Sticky site header with navigation                    |
| `BaseButton.vue`      | Reusable button with `primary` and `ghost` variants   |
| `EmptyState.vue`      | No-results / no-data state with optional slot         |
| `ErrorState.vue`      | Error message with a Retry button                     |
| `LoadingSkeleton.vue` | Pulsing card skeleton grid                            |
| `RocketCard.vue`      | Clickable rocket card (renders as `RouterLink`)       |
| `RocketFilter.vue`    | Search input — emits query string, makes no API calls |
| `RocketFormModal.vue` | Accessible modal for adding a locally-stored rocket   |
