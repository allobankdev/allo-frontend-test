import type { Rocket } from "@/types/rocket";
import type { LauncherDto } from "./rocketApi";

export function toRocket(dto: LauncherDto): Rocket {
    return {
        id: String(dto.id),
        name: dto.full_name || "Unnamed Rocket",
        description: dto.description || "No description available.",
        imageUrl: dto.image_url || null,
        launchCost: dto.launch_cost ?? null,
        country: dto.manufacturer?.country_code || "Unknown",
        firstFlight: dto.maiden_flight || null,
        active: dto.active ?? null,
        isCustom: false,
    };
}

export function toRockets(dtos: LauncherDto[]): Rocket[] {
    return dtos.map(toRocket);
}
