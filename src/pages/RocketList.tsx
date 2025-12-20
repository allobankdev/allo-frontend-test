import { useEffect, useMemo, useState } from 'react'
import { useRocketStore } from '../store/rocketStore'
import type { Rocket } from '../types/rocket.ts'
import Loading from '../components/Loading.tsx'
import ErrorState from '../components/ErrorState.tsx'
import Header from '../components/Header.tsx'
import { truncateText } from '../utils/truncate'

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
            <Header />
            <input
                type="text"
                placeholder="Filter rocket by name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />

            <button onClick={handleAddRocket}>Add Rocket</button>

            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                <thead className="bg-blue-100 font-bold">
                                    <tr>
                                        <th scope="col">Image</th>
                                        <th scope="col">Rocket Name</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                    {filteredRockets.map((rocket) => (
                                        <tr key={rocket.id}>
                                            <td>
                                                <img
                                                    src={
                                                        rocket.flickr_images[0]
                                                    }
                                                    alt={rocket.name}
                                                    width={300}
                                                    className="w-[40px] h-[40px] rounded-full"
                                                />
                                            </td>
                                            <td>{rocket.name}</td>
                                            <td>
                                                {truncateText(
                                                    rocket.description,
                                                    80
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
                                                >
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RocketList
