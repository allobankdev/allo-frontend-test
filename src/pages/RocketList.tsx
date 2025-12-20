import { useEffect, useMemo, useState } from 'react'
import { useRocketStore } from '../store/rocketStore'
import type { Rocket } from '../types/rocket.ts'
import { Link } from 'react-router-dom'

const RocketList = () => {
    const { rockets, loading, error, getRockets, addRocket } = useRocketStore()
    const [filter, setFilter] = useState('')

    useEffect(() => {
        getRockets()
    }, [getRockets])

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

    if (loading) return <p>Loading...</p>

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <button onClick={getRockets}>Retry</button>
            </div>
        )
    }

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
                    <li key={rocket.id}>
                        <Link to={`/rockets/${rocket.id}`}>{rocket.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RocketList
