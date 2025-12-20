import { useEffect, useMemo, useState } from 'react'
import { useRocketStore } from '../store/rocketStore'
import Loading from '../components/Loading.tsx'
import ErrorState from '../components/ErrorState.tsx'
import Header from '../components/Header.tsx'
import { truncateText } from '../utils/truncate'
import { Link } from 'react-router-dom'
import Button from '../components/Button.tsx'
import AddRocketForm from '../components/AddRocketForm.tsx'
import Modal from '../components/Modal.tsx'

const RocketList = () => {
    const { rockets, loading, error, getRockets, addRocket } = useRocketStore()
    const [filter, setFilter] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    if (loading) return <Loading />

    if (error) return <ErrorState message={error} onRetry={getRockets} />

    return (
        <>
            <Header />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Rocket"
            >
                <AddRocketForm
                    onSubmit={addRocket}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>

            <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div id="input-group">
                    <input
                        id="search"
                        type="text"
                        className="search-input"
                        placeholder="Filter rocket by name"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <div className="px-2 focus-within:relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5 text-gray-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                    </div>
                </div>

                <div className="sm:flex sm:justify-end">
                    <Button
                        label="Add Rocket"
                        onClick={() => setIsModalOpen(true)}
                        className="btn-custom w-full sm:w-[200px]"
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                <thead className="bg-purple-100 font-bold">
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
                                                <Link
                                                    to={`/rockets/${rocket.id}`}
                                                >
                                                    <button
                                                        type="button"
                                                        className="btn-custom px-2 py-1 text-white bg-purple-800 flex justify-center"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="2.0"
                                                            stroke="currentColor"
                                                            className="size-5"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                            />
                                                        </svg>
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RocketList
