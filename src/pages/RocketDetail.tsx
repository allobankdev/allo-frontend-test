import { useParams } from 'react-router-dom'

const RocketDetailPage = () => {
    const { id } = useParams()

    return <h1>Rocket Detail Page: {id}</h1>
}

export default RocketDetailPage
