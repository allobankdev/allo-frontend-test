const API_BASE_URL = "https://lldev.thespacedevs.com/2.2.0/config/launcher"

export interface LauncherDto {
    id: number;
    full_name: string;
    description: string | null;
    image_url: string | null;
    launch_cost: number | null;
    maiden_flight: string | null;
    active: boolean | null;
    manufacturer: {
        country_code: string | null;
    } | null;
}

export interface LauncherListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: LauncherDto[];
}

export async function fetchRockets(signal?: AbortSignal): Promise<LauncherDto[]> {
    const url = `${API_BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`;

    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`Failed to fetch rockets: HTTP ${response.status}`);
    }

    const data: unknown = await response.json();

    if (
        typeof data !== "object" ||
        data === null ||
        !("results" in data) ||
        !Array.isArray(data.results)
    ) {
        throw new Error("Invalid rocket API response");
    }

    return (data as LauncherListResponse).results;
}

export async function fetchRocketById(
    id: string,
    signal?: AbortSignal,
): Promise<LauncherDto> {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}/`, {
        signal,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch rocket: HTTP ${response.status}`);
    }

    return (await response.json()) as LauncherDto;
}
