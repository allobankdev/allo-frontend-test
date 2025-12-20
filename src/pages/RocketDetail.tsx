import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRocketStore } from '../store/rocketStore'
import Loading from '../components/Loading.tsx'
import ErrorState from '../components/ErrorState.tsx'

const RocketDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { rockets, loading, error, getRockets } = useRocketStore()

    useEffect(() => {
        if (rockets.length === 0) {
            getRockets()
        }
    }, [rockets.length, getRockets])

    if (loading) return <Loading />

    if (error) return <ErrorState message={error} onRetry={getRockets} />

    const rocket = rockets.find((r) => r.id === id)

    if (!rocket) {
        return (
            <div>
                <p>Rocket not found</p>
                <button onClick={() => navigate('/')}>Back to list</button>
            </div>
        )
    }

    return (
        <div>
            <h1>{rocket.name}</h1>

            {rocket.flickr_images[0] && (
                <img
                    src={rocket.flickr_images[0]}
                    alt={rocket.name}
                    width={300}
                />
            )}

            <p>{rocket.description}</p>
            <p>Country: {rocket.country}</p>
            <p>Cost per launch: ${rocket.cost_per_launch}</p>
            <p>First flight: {rocket.first_flight}</p>

            <button onClick={() => navigate('/')}>Back</button>
        </div>
    )
}

export default RocketDetailPage
