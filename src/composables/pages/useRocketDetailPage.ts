import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { useRocketsStore } from "@/stores/rockets";
import {
  formatBool,
  formatDate,
  formatLength,
  formatNumber,
  formatThrust,
  formatUsd,
} from "@/utils/format";

import type { KeyValueItem } from "@/components/KeyValueSection.vue";

type SpecSection = { title: string; md: number; items: KeyValueItem[] };

function item(key: string, value: string): KeyValueItem | null {
  const v = value?.trim?.() ?? value;
  if (!v || v === "-") return null;
  return { key, value };
}

export function useRocketDetailPage() {
  const route = useRoute();
  const router = useRouter();
  const store = useRocketsStore();
  const display = useDisplay();

  const fallbackImageUrl = new URL(
    "../../assets/rocket-error.jpg",
    import.meta.url
  ).toString();

  const heroHeight = computed(() => (display.smAndDown.value ? 240 : 320));

  const id = computed(() => String(route.params.id || ""));
  const rocket = computed(() => store.getById(id.value));

  const status = computed(() => store.getDetailStatus(id.value));
  const error = computed(() => store.getDetailError(id.value));

  const showDetails = ref(false);

  const specSections = computed<SpecSection[]>(() => {
    const r = rocket.value;
    if (!r) return [];

    const sections: SpecSection[] = [];

    const dimensions: KeyValueItem[] = [
      r.height ? item("Height", formatLength(r.height)) : null,
      r.diameter ? item("Diameter", formatLength(r.diameter)) : null,
    ].filter(Boolean) as KeyValueItem[];
    if (dimensions.length)
      sections.push({ title: "Dimensions", md: 6, items: dimensions });

    const mass: KeyValueItem[] = r.mass
      ? ([
          item("kg", formatNumber(r.mass.kg)),
          item("lb", formatNumber(r.mass.lb)),
        ].filter(Boolean) as KeyValueItem[])
      : [];
    if (mass.length) sections.push({ title: "Mass", md: 6, items: mass });

    if (r.first_stage) {
      const s = r.first_stage;
      const items: KeyValueItem[] = [
        item("Reusable", formatBool(s.reusable)),
        item("Engines", formatNumber(s.engines)),
        item("Fuel amount (tons)", formatNumber(s.fuel_amount_tons)),
        item("Burn time (sec)", formatNumber(s.burn_time_sec)),
        item("Thrust sea level", formatThrust(s.thrust_sea_level)),
        item("Thrust vacuum", formatThrust(s.thrust_vacuum)),
      ].filter(Boolean) as KeyValueItem[];
      if (items.length) sections.push({ title: "First stage", md: 12, items });
    }

    if (r.second_stage) {
      const s = r.second_stage;
      const fairing = s.payloads?.composite_fairing;
      const fairingText = fairing
        ? `Height: ${formatLength(fairing.height)}, Diameter: ${formatLength(
            fairing.diameter
          )}`
        : "-";

      const items: KeyValueItem[] = [
        item("Reusable", formatBool(s.reusable)),
        item("Engines", formatNumber(s.engines)),
        item("Fuel amount (tons)", formatNumber(s.fuel_amount_tons)),
        item("Burn time (sec)", formatNumber(s.burn_time_sec)),
        item("Thrust", formatThrust(s.thrust)),
        item("Payload option", s.payloads?.option_1 ?? "-"),
        item("Composite fairing", fairingText),
      ].filter(Boolean) as KeyValueItem[];
      if (items.length) sections.push({ title: "Second stage", md: 12, items });
    }

    if (r.engines) {
      const e = r.engines;
      const items: KeyValueItem[] = [
        item("Number", formatNumber(e.number)),
        item("Type", `${e.type} ${e.version}`.trim()),
        item("Layout", e.layout ?? "-"),
        item(
          "Isp (sea/vac)",
          `${formatNumber(e.isp.sea_level)} / ${formatNumber(e.isp.vacuum)}`
        ),
        item("Thrust sea level", formatThrust(e.thrust_sea_level)),
        item("Thrust vacuum", formatThrust(e.thrust_vacuum)),
        item("Propellant", `${e.propellant_1} + ${e.propellant_2}`),
        item("T/W", formatNumber(e.thrust_to_weight)),
      ].filter(Boolean) as KeyValueItem[];
      if (items.length) sections.push({ title: "Engines", md: 12, items });
    }

    if (r.landing_legs) {
      const l = r.landing_legs;
      const items: KeyValueItem[] = [
        item("Number", l.number === null ? "-" : String(l.number)),
        item("Material", l.material ?? "-"),
      ].filter(Boolean) as KeyValueItem[];
      if (items.length) sections.push({ title: "Landing legs", md: 6, items });
    }

    if (r.payload_weights?.length) {
      const items: KeyValueItem[] = r.payload_weights
        .map((p) =>
          item(p.name, `${formatNumber(p.kg)} kg (${formatNumber(p.lb)} lb)`)
        )
        .filter(Boolean) as KeyValueItem[];
      if (items.length)
        sections.push({ title: "Payload weights", md: 6, items });
    }

    return sections;
  });

  let controller: AbortController | null = null;

  function reload(force = false) {
    if (!id.value) return;
    if (rocket.value?.source === "local") return;

    controller?.abort();
    controller = new AbortController();
    store.loadById(id.value, { force, signal: controller.signal });
  }

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  onMounted(() => {
    reload(false);
  });

  watch(id, () => {
    reload(false);
  });

  onBeforeUnmount(() => {
    controller?.abort();
  });

  return {
    fallbackImageUrl,
    heroHeight,
    rocket,
    status,
    error,
    showDetails,
    specSections,
    reload,
    goBack,
    formatDate,
    formatUsd,
  };
}
