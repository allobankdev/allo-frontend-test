export interface Rocket {
    id: string;
    name: string;
    description: string;
    imageUrl: string | null;
    launchCost: number | null;
    country: string;
    firstFlight: string | null;
    active: boolean | null;
    isCustom: boolean;
}

export interface RocketInput {
    name: string;
    description: string;
    imageUrl: string | null;
    launchCost: number;
    country: string;
    firstFlight: string;
    active: boolean;
}
