import { useEffect } from 'react'
import { useRocketStore } from '../store/rocketStore'

const RocketList = () => {
    const { rockets, loading, error, getRockets } = useRocketStore()

    useEffect(() => {
        getRockets()
    }, [getRockets])

    if (loading) {
        return <p>Loading...</p>
    }

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
            <ul>
                {rockets.map((rocket) => (
                    <li key={rocket.id}>{rocket.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default RocketList
