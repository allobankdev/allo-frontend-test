import { AppRouter } from './router/AppRouter.tsx'
import { Toaster } from 'react-hot-toast'

function App() {
    return (
        <>
            <div className="container mx-auto">
                <AppRouter />
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    )
}

export default App
