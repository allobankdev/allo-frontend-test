import Button from './Button.tsx'

interface ErrorStateProps {
    message: string | null
    onRetry: () => void
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
    return (
        <div className="flex flex-col mt-10">
            <p>{message ?? 'Failed to fetch rockets. Please try again.'}</p>
            <Button
                label="Retry"
                onClick={onRetry}
                className="btn-custom w-[200px] bg-red-700"
            />
        </div>
    )
}

export default ErrorState
