import { useState } from 'react'
import Button from './Button'
import type { Rocket } from '../types/rocket.ts'

interface AddRocketFormProps {
    onSubmit: (rocket: Rocket) => void
    onClose: () => void
}

const AddRocketForm = ({ onSubmit, onClose }: AddRocketFormProps) => {
    const [images, setImages] = useState<string[]>([
        'https://live.staticflickr.com/65535/48953946911_e60c5bcc5c_b.jpg',
    ])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [country, setCountry] = useState('')
    const [cost, setCost] = useState('')
    const [firstFlight, setFirstFlight] = useState('')

    const handleSubmit = () => {
        if (!name || !description) return

        const newRocket: Rocket = {
            id: crypto.randomUUID(),
            name,
            description,
            country,
            cost_per_launch: Number(cost) || 0,
            first_flight: firstFlight,
            flickr_images: images.filter(Boolean),
        }

        onSubmit(newRocket)
        onClose()
    }

    const handleImageChange = (index: number, value: string) => {
        const updated = [...images]
        updated[index] = value
        setImages(updated)
    }

    const addImageField = () => {
        setImages([
            ...images,
            'https://live.staticflickr.com/65535/48954138962_ee541e6755_b.jpg',
        ])
    }

    const removeImageField = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-3">
            <input
                placeholder="Rocket Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border w-full p-2"
            />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border w-full p-2"
            />

            <input
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="border w-full p-2"
            />

            <input
                placeholder="Cost per launch"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="border w-full p-2"
            />

            <div>
                <label className="text-sm font-medium">First Flight</label>
                <input
                    type="date"
                    value={firstFlight}
                    onChange={(e) => setFirstFlight(e.target.value)}
                    className="border w-full p-2"
                    required
                    max={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div>
                <label className="text-sm font-medium">Image URLs</label>

                <div className="space-y-2 mt-1">
                    {images.map((img, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="https://image-url.com"
                                value={img}
                                onChange={(e) =>
                                    handleImageChange(index, e.target.value)
                                }
                                className="border w-full p-2"
                            />

                            {images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeImageField(index)}
                                    className="text-red-500"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addImageField}
                    className="text-blue-600 text-sm mt-2"
                >
                    + Add another image
                </button>

                {/* Preview Image */}
                {images.map(
                    (img) =>
                        img && (
                            <img
                                key={img}
                                src={img}
                                alt="preview"
                                className="h-24 mt-2 object-cover rounded"
                            />
                        )
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    label="Cancel"
                    className="btn-custom bg-red-600 w-[100px]"
                    onClick={onClose}
                />
                <Button
                    label="Add Rocket"
                    onClick={handleSubmit}
                    className="btn-custom w-[150px]"
                />
            </div>
        </div>
    )
}

export default AddRocketForm
