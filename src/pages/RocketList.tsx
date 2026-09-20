import { useEffect, useState } from 'react';
import { useRocketStore } from '../store/rocketStore';
import RocketCard from '../components/RocketCard';
import AddRocketForm from '../components/AddRocketForm';
import './RocketList.css';

export default function RocketList() {
  const { rockets, isLoading, error, fetchRockets } = useRocketStore();
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchRockets();
  }, [fetchRockets]);

  const filteredRockets = rockets.filter((r) =>
    r.full_name.toLowerCase().includes(filter.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="rocket-list-page">
        <p className="rocket-list__status">Loading rockets…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rocket-list-page">
        <p className="rocket-list__status rocket-list__status--error">Error: {error}</p>
        <button className="rocket-list__retry-btn" onClick={fetchRockets}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rocket-list-page">
      <h1 className="rocket-list__heading">SpaceX Rockets</h1>

      <div className="rocket-list__controls">
        <input
          id="rocket-filter"
          className="rocket-list__filter"
          type="search"
          placeholder="Filter by name…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <AddRocketForm />

      <section className="rocket-list__grid" aria-label="Rocket list">
        {filteredRockets.length === 0 ? (
          <p className="rocket-list__status">No rockets match your filter.</p>
        ) : (
          filteredRockets.map((rocket) => (
            <RocketCard key={rocket.id} rocket={rocket} />
          ))
        )}
      </section>
    </div>
  );
}
