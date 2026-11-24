import type {
  LauncherListResponse,
  LauncherResponse,
  Rocket,
} from "@/types/rocket";

const baseUrl = import.meta.env.VITE_APP_API_URL;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nullableText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function parseLauncher(value: unknown): LauncherResponse {
  if (
    !isRecord(value) ||
    typeof value.id !== "number" ||
    !Number.isSafeInteger(value.id) ||
    value.id < 1
  ) {
    throw new Error("Respons API berisi data rocket yang tidak valid.");
  }

  return {
    id: value.id,
    image_url: nullableText(value.image_url),
    full_name: nullableText(value.full_name),
    description: nullableText(value.description),
    launch_cost:
      typeof value.launch_cost === "number" &&
      Number.isFinite(value.launch_cost)
        ? value.launch_cost
        : nullableText(value.launch_cost),
    manufacturer: isRecord(value.manufacturer)
      ? { country_code: nullableText(value.manufacturer.country_code) }
      : null,
    maiden_flight: nullableText(value.maiden_flight),
  };
}

function toRocket(launcher: LauncherResponse): Rocket {
  return {
    id: String(launcher.id),
    source: "api",
    name: launcher.full_name ?? null,
    description: launcher.description ?? null,
    imageUrl: launcher.image_url ?? null,
    launchCost: launcher.launch_cost ?? null,
    country: launcher.manufacturer?.country_code ?? null,
    firstFlight: launcher.maiden_flight ?? null,
  };
}

async function request(url: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  } catch {
    throw new Error(
      "Tidak dapat menghubungi API. Periksa koneksi Anda lalu coba lagi.",
    );
  }

  if (!response.ok) {
    if (response.status === 404)
      throw new Error("Rocket tidak ditemukan di API (404).");
    if (response.status === 429)
      throw new Error(
        "Batas permintaan API tercapai (429). Tunggu beberapa saat lalu coba lagi.",
      );
    throw new Error(
      `Gagal memuat data dari API (HTTP ${response.status}). Silakan coba lagi.`,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new Error("Respons API bukan JSON yang valid. Silakan coba lagi.");
  }
}

export async function fetchRockets(): Promise<Rocket[]> {
  const data = await request(
    `${baseUrl}?manufacturer__name=SpaceX&mode=detailed&limit=20`,
  );
  if (
    !isRecord(data) ||
    !Array.isArray(data.results) ||
    typeof data.count !== "number"
  ) {
    throw new Error("Format respons daftar rocket tidak valid.");
  }
  const page: LauncherListResponse = {
    count: data.count,
    next: nullableText(data.next),
    previous: nullableText(data.previous),
    results: data.results.map(parseLauncher),
  };
  return page.results.map(toRocket);
}

export async function fetchRocket(id: string): Promise<Rocket> {
  const rocket = toRocket(
    parseLauncher(await request(`${baseUrl}${encodeURIComponent(id)}/`)),
  );
  if (rocket.id !== id)
    throw new Error("ID rocket dalam respons API tidak sesuai.");
  return rocket;
}
