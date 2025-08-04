export interface RocketFormData {
    id?: string;
    name: string;
    description: string;
    height: { meters: number; feet: number };
    diameter: { meters: number; feet: number };
    mass: { kg: number; lb: number };
    first_flight: string;
    country: string;
    company: string;
    stages: number;
    boosters: number;
    wikipedia: string;
    active: boolean;
    cost_per_launch: number;
    success_rate_pct: number;
    flickr_images: string[];
}
export interface Rocket {
    id: string;
    name: string;
    description: string;
    height: { meters: number; feet: number };
    diameter: { meters: number; feet: number };
    mass: { kg: number; lb: number };
    first_flight: string;
    country: string;
    company: string;
    wikipedia: string;
    active: boolean;
    cost_per_launch: number;
    success_rate_pct: number;
    flickr_images: string[];
}
export interface RocketCard {
    id: string;
    name: string;
    description: string;
    flickr_images: string[];
}
export interface RocketState {
    rockets: Rocket[];
    loading: boolean;
    error: boolean;
}