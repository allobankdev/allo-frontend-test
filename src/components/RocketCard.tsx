import { Link } from 'react-router-dom';
import type { Rocket } from '../types/rocket';
import './RocketCard.css';

interface Props {
  rocket: Rocket;
}

export default function RocketCard({ rocket }: Props) {
  return (
    <Link to={`/rocket/${rocket.id}`} className="rocket-card">
      <div className="rocket-card__image-wrap">
        {rocket.image_url ? (
          <img
            src={rocket.image_url}
            alt={rocket.full_name}
            className="rocket-card__image"
          />
        ) : (
          <div className="rocket-card__image-placeholder" aria-label="No image available" />
        )}
      </div>
      <div className="rocket-card__body">
        <h2 className="rocket-card__name">{rocket.full_name}</h2>
        <p className="rocket-card__description">
          {rocket.description || 'No description available.'}
        </p>
      </div>
    </Link>
  );
}
