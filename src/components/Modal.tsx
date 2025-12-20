import type { ReactNode } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-full max-w-md rounded">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {children}
            </div>
        </div>
    )
}

export default Modal
