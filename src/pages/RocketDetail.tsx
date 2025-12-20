import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRocketStore } from '../store/rocketStore'
import Loading from '../components/Loading.tsx'
import ErrorState from '../components/ErrorState.tsx'
import Button from '../components/Button.tsx'
import ImageCarousel from '../components/ImageCarousel.tsx'

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
            <div className="mx-auto w-full md:w-1/2 rounded overflow-hidden shadow-lg p-3">
                <ImageCarousel
                    images={rocket.flickr_images}
                    alt={rocket.name}
                />
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{rocket.name}</div>
                    <p className="text-gray-700 text-base">
                        {rocket.description}
                    </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        Country: {rocket.country}
                    </span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        Cost per launch: ${rocket.cost_per_launch}
                    </span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        First flight: {rocket.first_flight}
                    </span>
                </div>
                <div className="px-6 pt-4 pb-2">
                    <Button
                        label="Back to list"
                        onClick={() => navigate('/')}
                        className="btn-custom w-full bg-purple-800"
                    />
                </div>
            </div>
        </div>
    )
}

export default RocketDetailPage
