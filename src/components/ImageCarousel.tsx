import { useState } from 'react'

interface ImageCarouselProps {
    images: string[]
    alt: string
}

const ImageCarousel = ({ images, alt }: ImageCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!images || images.length === 0) return null

    const prev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const next = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="relative w-full">
            <img
                src={images[currentIndex]}
                alt={alt}
                className="w-full max-h-[400px] object-contain"
            />

            <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded"
                aria-label="Previous image"
            >
                ‹
            </button>

            <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded"
                aria-label="Next image"
            >
                ›
            </button>

            <div className="flex justify-center gap-2 mt-2">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                            index === currentIndex
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default ImageCarousel
