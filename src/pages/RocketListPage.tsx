import React, { useEffect, useState, useMemo } from 'react';
import { useRocket } from '../context/RocketContext';
import { RocketCard } from '../components/RocketCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { ErrorView } from '../components/ErrorView';
import { AddRocketModal } from '../components/AddRocketModal';

export const RocketListPage: React.FC = () => {
  const { state, loadRockets, setSearchQuery } = useRocket();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (state.status === 'IDLE' && state.rockets.length === 0) {
      loadRockets();
    }
  }, [state.status, state.rockets.length]);

  const filteredRockets = useMemo(() => {
    const query = state.searchQuery.toLowerCase().trim();
    if (!query) return state.rockets;
    return state.rockets.filter((r) => {
      const matchName = r.full_name?.toLowerCase().includes(query) ?? false;
      const matchDesc = r.description?.toLowerCase().includes(query) ?? false;
      return matchName || matchDesc;
    });
  }, [state.rockets, state.searchQuery]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header bar */}
      <header className="mb-6 pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          SpaceX Launch Vehicles
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-1">
          Catalog source: Launch Library 2 (v2.2.0)
        </p>
      </header>

      {/* Control bar */}
      <section className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Filter configurations..."
            value={state.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-sans"
          />
          {state.searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-slate-600 font-mono"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          + Add Rocket
        </button>
      </section>

      {/* Loading state: Understated Skeletons */}
      {state.status === 'LOADING' && state.rockets.length === 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </section>
      )}

      {/* Error state: Minimalist Error Box with Retry */}
      {state.status === 'ERROR' && state.rockets.length === 0 && (
        <section className="py-12">
          <ErrorView message={state.error} onRetry={loadRockets} />
        </section>
      )}

      {/* Success / Loaded Data state */}
      {(state.rockets.length > 0 || state.status === 'SUCCESS') && (
        <>
          {filteredRockets.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-200 rounded-lg bg-white">
              <p className="text-xs text-slate-500 font-mono">
                No configurations matched filter: "{state.searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-slate-900 underline font-medium"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRockets.map((rocket) => (
                <RocketCard key={rocket.id} rocket={rocket} />
              ))}
            </section>
          )}
        </>
      )}

      <AddRocketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
};
