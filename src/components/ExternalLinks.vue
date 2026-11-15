<template>
  <div
    v-if="infoUrl || wikiUrl"
    class="flex flex-wrap gap-2"
  >
    <a
      v-for="link in links"
      :key="link.label"
      :href="link.href"
      target="_blank"
      rel="noopener noreferrer"
      class="btn-secondary px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
    >
      {{ link.label }}
      <span
        class="mdi mdi-arrow-top-right text-sm text-slate-500"
        aria-hidden="true"
      />
    </a>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    infoUrl: string | null
    wikiUrl: string | null
  }>()

  const links = computed(() => [
    { label: 'Official site', href: props.infoUrl },
    { label: 'Wikipedia', href: props.wikiUrl },
  ].filter((link): link is { label: string, href: string } => link.href !== null))
</script>
