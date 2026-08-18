import { defineStore } from "pinia";
import type { Manufacturer, Result, RocketData } from '@/types/types';
import axios from 'axios';

export const useRocketStore = defineStore('rocketStore', {
    state: () => ({
        data: null as RocketData | null,
        loading: false,
        exception: '',
    }),
    actions: {
        async getData() {
            if (!this.data) {
                console.log("get data");

                this.loading = true
                this.exception = ''

                try {
                    const res = await axios.get('https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed')
                    this.data = res.data
                } catch (error) {
                    if (error instanceof Error) {
                        this.exception = 'Get data failed: ' + error.message
                    } else {
                        this.exception = 'Unknown error: ' + error
                    }
                } finally {
                    this.loading = false
                }
            }
            console.log("not get data");
        },
        addRocket(imageUrl: string, fullName: string, description: string, launchCost: string, country: string, maidenFlight: string) {
            const maxId = Math.max(...this.data?.results?.map(result => result.id) || [])
            const newManufacturer: Manufacturer = {
                id: 0,
                url: '',
                name: '',
                featured: false,
                type: '',
                country_code: country,
                abbrev: '',
                description: '',
                administrator: '',
                founding_year: '',
                launchers: '',
                spacecraft: '',
                launch_library_url: null,
                total_launch_count: 0,
                consecutive_successful_launches: 0,
                successful_launches: 0,
                failed_launches: 0,
                pending_launches: 0,
                consecutive_successful_landings: 0,
                successful_landings: 0,
                failed_landings: 0,
                attempted_landings: 0,
                info_url: '',
                wiki_url: '',
                logo_url: '',
                image_url: '',
                nation_url: ''
            }
            const newRocket: Result = {
                id: maxId + 1,
                url: '',
                name: fullName,
                active: false,
                reusable: false,
                description: description,
                family: '',
                full_name: fullName,
                manufacturer: newManufacturer,
                program: [],
                variant: '',
                alias: '',
                min_stage: 0,
                max_stage: 0,
                length: 0,
                diameter: 0,
                maiden_flight: new Date(maidenFlight),
                launch_cost: launchCost || null,
                launch_mass: 0,
                leo_capacity: 0,
                gto_capacity: null,
                to_thrust: 0,
                apogee: null,
                vehicle_range: null,
                image_url: imageUrl,
                info_url: null,
                wiki_url: '',
                total_launch_count: 0,
                consecutive_successful_launches: 0,
                successful_launches: 0,
                failed_launches: 0,
                pending_launches: 0,
                attempted_landings: 0,
                successful_landings: 0,
                failed_landings: 0,
                consecutive_successful_landings: 0,
            }
            this.data?.results?.push(newRocket)
        },
        getResultById(id: number) {
            return this.data?.results?.find(result => result.id === id)
        }
    }
})
