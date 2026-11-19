import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRocket } from '../context/RocketContext';
import { Rocket, Status } from '../types/rocket';
import { fetchRocketById } from '../services/api';
import { SafeImage } from '../components/SafeImage';
import { ErrorView } from '../components/ErrorView';

export const RocketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getRocketById } = useRocket();

  const [rocket, setRocket] = useState<Rocket | null>(null);
  const [status, setStatus] = useState<Status>('IDLE');
  const [error, setError] = useState<string | null>(null);

  const resolveRocket = useCallback(async () => {
    if (!id) return;

    // Resolve from global state first (cached or local creation)
    const existing = getRocketById(id);
    if (existing) {
      setRocket(existing);
      setStatus('SUCCESS');
      return;
    }

    if (id.startsWith('local-')) {
      setStatus('ERROR');
      setError('Local session configuration record not found.');
      return;
    }

    setStatus('LOADING');
    setError(null);
    try {
      const data = await fetchRocketById(id);
      setRocket(data);
      setStatus('SUCCESS');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to retrieve launcher configuration';
      setError(msg);
      setStatus('ERROR');
    }
  }, [id, getRocketById]);

  useEffect(() => {
    resolveRocket();
  }, [resolveRocket]);

  const formatCost = (cost: number | string | null | undefined): string => {
    if (cost === null || cost === undefined || cost === '') return 'N/A';
    const num = Number(cost);
    if (isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <nav className="mb-6">
        <Link
          to="/"
          className="text-xs font-mono text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors"
        >
          <span>←</span> Back to Launcher List
        </Link>
      </nav>

      {/* Loading Skeleton for Detail */}
      {status === 'LOADING' && (
        <section className="bg-white border border-slate-200 rounded-lg p-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-video bg-slate-100 rounded" />
            <div className="space-y-4">
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
                <div className="h-3 bg-slate-100 rounded w-4/6" />
              </div>
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-3">
                <div className="h-10 bg-slate-100 rounded" />
                <div className="h-10 bg-slate-100 rounded" />
                <div className="h-10 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error state */}
      {status === 'ERROR' && (
        <section className="py-12">
          <ErrorView message={error} onRetry={resolveRocket} />
        </section>
      )}

      {/* Success / Loaded Data */}
      {status === 'SUCCESS' && rocket && (
        <article className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Left/Top Media Column */}
            <div className="md:col-span-5 bg-slate-50">
              <div className="relative aspect-video md:aspect-auto md:h-full w-full">
                <SafeImage
                  src={rocket.image_url}
                  alt={rocket.full_name || 'Launcher Configuration'}
                  containerClassName="w-full h-full min-h-[260px]"
                />
                {rocket.isLocal && (
                  <span className="absolute top-3 left-3 bg-slate-900 text-slate-100 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded">
                    Local Record
                  </span>
                )}
              </div>
            </div>

            {/* Right Specification Column */}
            <div className="md:col-span-7 p-6 flex flex-col justify-between">
              <div>
                <header className="mb-4">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    LAUNCHER CONFIGURATION #{rocket.id}
                  </span>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    {rocket.full_name || 'Unnamed Configuration'}
                  </h1>
                </header>

                <p className="text-xs leading-relaxed text-slate-600 mb-8">
                  {rocket.description?.trim() || 'No description available for this configuration.'}
                </p>
              </div>

              {/* Technical Specifications Table */}
              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Vehicle Specifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border border-slate-200 rounded p-3 bg-slate-50">
                    <span className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Cost Per Launch
                    </span>
                    <span className="text-sm font-semibold font-mono tabular-nums text-slate-900">
                      {formatCost(rocket.launch_cost)}
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded p-3 bg-slate-50">
                    <span className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Origin Country
                    </span>
                    <span className="text-sm font-semibold font-mono text-slate-900">
                      {rocket.manufacturer?.country_code || (
                        <span className="text-slate-400 font-normal">N/A</span>
                      )}
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded p-3 bg-slate-50">
                    <span className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      First Flight
                    </span>
                    <span className="text-sm font-semibold font-mono tabular-nums text-slate-900">
                      {rocket.maiden_flight || (
                        <span className="text-slate-400 font-normal">N/A</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      )}
    </main>
  );
};
