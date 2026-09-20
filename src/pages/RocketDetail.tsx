import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRocketStore } from '../store/rocketStore';
import './RocketDetail.css';

export default function RocketDetail() {
  const { id } = useParams<{ id: string }>();
  const { rockets, isLoading, error, fetchRockets } = useRocketStore();

  // Handle direct visit / page refresh: store is empty, so fetch data.
  useEffect(() => {
    if (rockets.length === 0) {
      fetchRockets();
    }
  }, [rockets.length, fetchRockets]);

  if (isLoading) {
    return (
      <div className="rocket-detail-page">
        <p className="rocket-detail__status">Loading rocket…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rocket-detail-page">
        <p className="rocket-detail__status rocket-detail__status--error">Error: {error}</p>
        <button className="rocket-detail__retry-btn" onClick={fetchRockets}>
          Retry
        </button>
      </div>
    );
  }

  const rocket = rockets.find((r) => String(r.id) === id);

  if (!rocket) {
    return (
      <div className="rocket-detail-page">
        <Link to="/" className="rocket-detail__back">← Back to List</Link>
        <p className="rocket-detail__status">Rocket not found.</p>
      </div>
    );
  }

  return (
    <div className="rocket-detail-page">
      <Link to="/" className="rocket-detail__back">← Back to List</Link>

      <div className="rocket-detail__layout">
        <div className="rocket-detail__image-wrap">
          {rocket.image_url ? (
            <img
              src={rocket.image_url}
              alt={rocket.full_name}
              className="rocket-detail__image"
            />
          ) : (
            <div className="rocket-detail__image-placeholder" aria-label="No image available" />
          )}
        </div>

        <div className="rocket-detail__info">
          <h1 className="rocket-detail__name">{rocket.full_name}</h1>

          <p className="rocket-detail__description">
            {rocket.description || 'No description available.'}
          </p>

          <dl className="rocket-detail__meta">
            <div className="rocket-detail__meta-row">
              <dt>Cost per Launch</dt>
              <dd>{rocket.launch_cost ?? 'N/A'}</dd>
            </div>
            <div className="rocket-detail__meta-row">
              <dt>Country</dt>
              <dd>{rocket.manufacturer?.country_code ?? 'N/A'}</dd>
            </div>
            <div className="rocket-detail__meta-row">
              <dt>First Flight</dt>
              <dd>{rocket.maiden_flight ?? 'Not Available'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
