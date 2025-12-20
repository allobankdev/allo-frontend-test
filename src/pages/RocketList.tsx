import { useEffect, useMemo, useState } from 'react'
import { useRocketStore } from '../store/rocketStore'
import type { Rocket } from '../types/rocket.ts'
import Loading from '../components/Loading.tsx'
import ErrorState from '../components/ErrorState.tsx'
import RocketCard from '../components/RocketCard.tsx'

const RocketList = () => {
    const { rockets, loading, error, getRockets, addRocket } = useRocketStore()
    const [filter, setFilter] = useState('')

    useEffect(() => {
        if (rockets.length === 0) {
            getRockets()
        }
    }, [rockets.length, getRockets])

    const filteredRockets = useMemo(() => {
        return rockets.filter((rocket) =>
            rocket.name.toLowerCase().includes(filter.toLowerCase())
        )
    }, [rockets, filter])

    const handleAddRocket = () => {
        const newRocket: Rocket = {
            id: crypto.randomUUID(),
            name: 'My Custom Rocket',
            description: 'This is a custom rocket added locally',
            country: 'Indonesia',
            cost_per_launch: 0,
            first_flight: '2025-01-01',
            flickr_images: [],
        }

        addRocket(newRocket)
    }

    if (loading) return <Loading />

    if (error) return <ErrorState message={error} onRetry={getRockets} />

    return (
        <div>
            <h1>Rocket List</h1>
            <input
                type="text"
                placeholder="Filter rocket by name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />

            <button onClick={handleAddRocket}>Add Rocket</button>

            <ul>
                {filteredRockets.map((rocket) => (
                    <RocketCard key={rocket.id} rocket={rocket} />
                ))}
            </ul>
        </div>
    )
}

export default RocketList
