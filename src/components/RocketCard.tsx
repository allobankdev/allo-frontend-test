import { Link } from 'react-router-dom'
import type { Rocket } from '../types/rocket'

interface RocketCardProps {
    rocket: Rocket
}

const RocketCard = ({ rocket }: RocketCardProps) => {
    return (
        <div>
            <Link to={`/rockets/${rocket.id}`}>
                <h3>{rocket.name}</h3>
            </Link>
            <p>{rocket.description}</p>
        </div>
    )
}

export default RocketCard
