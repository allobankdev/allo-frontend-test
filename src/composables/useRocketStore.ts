import { reactive } from 'vue';
import type { Rocket } from '@/types/rocket';
import { spacexService } from '@/services/spacexService';

// Global state to persist data across route navigation
const state = reactive({
    rockets: [] as Rocket[],
    loading: false,
    error: null as string | null,
    isLoaded: false, // To prevent re-fetching if already loaded
});

export function useRocketStore() {

    const fetchRockets = async () => {
        // specific requirement: "Show loading when waiting response from API"
        // "If an error occurred, user can retry"
        // "Show result when get response"

        if (state.isLoaded && !state.error) return; // cache

        state.loading = true;
        state.error = null;
        try {
            const data = await spacexService.getRockets();
            // Merge with existing if needed, but for now just replace (unless we have local additions? 
            // Requirement says "Add new rocket". If we re-fetch, we lose local additions unless we separate them.
            // Let's assume we just fetch once on mount/init.

            // If we already have local rockets (maybe added before fetch?), we should be careful. 
            // But typically we fetch first.

            // A simple strategy: only fetch if empty. 
            if (state.rockets.length === 0) {
                state.rockets = data;
            }
            state.isLoaded = true;
        } catch (err: unknown) {
            if (err instanceof Error) {
                state.error = err.message;
            } else {
                state.error = 'Failed to fetch rockets';
            }
        } finally {
            state.loading = false;
        }
    };

    const addRocket = (rocket: Rocket) => {
        state.rockets.push(rocket);
    };

    const getRocketById = (id: string) => {
        return state.rockets.find(r => r.id === id);
    };

    const retryFetch = () => {
        state.isLoaded = false;
        fetchRockets();
    };

    return {
        state,
        fetchRockets,
        addRocket,
        getRocketById,
        retryFetch
    };
}
