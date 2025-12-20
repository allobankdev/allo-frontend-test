import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RocketList from '../pages/RocketList'
import RocketDetail from '../pages/RocketDetail'

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RocketList />} />
                <Route path="/rockets/:id" element={<RocketDetail />} />
            </Routes>
        </BrowserRouter>
    )
}
