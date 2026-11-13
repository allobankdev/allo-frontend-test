export const ENDPOINTS = {
    ROCKET_LIST: "/config/launcher/", 
    ROCKET_DETAIL: (id: number) => `/config/launcher/${id}/`
} as const;