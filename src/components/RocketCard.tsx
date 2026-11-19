import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from '../types/rocket';
import { SafeImage } from './SafeImage';

interface RocketCardProps {
  rocket: Rocket;
}

export const RocketCard: React.FC<RocketCardProps> = ({ rocket }) => {
  const descriptionText = rocket.description?.trim() || 'No description available.';

  return (
    <article className="h-full flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden transition-colors hover:border-slate-400">
      <Link to={`/rockets/${rocket.id}`} className="block relative aspect-video w-full bg-slate-100 border-b border-slate-100">
        <SafeImage
          src={rocket.image_url}
          alt={rocket.full_name || 'SpaceX Launch Vehicle'}
          containerClassName="w-full h-full"
        />
        {rocket.isLocal && (
          <span className="absolute top-2.5 right-2.5 bg-slate-900 text-slate-100 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded">
            Local Record
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 tracking-tight leading-snug">
            <Link to={`/rockets/${rocket.id}`} className="hover:underline">
              {rocket.full_name || 'Unnamed Configuration'}
            </Link>
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
            {descriptionText}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            ID: {rocket.id}
          </span>
          <Link
            to={`/rockets/${rocket.id}`}
            className="text-xs font-medium text-slate-900 hover:text-slate-600 inline-flex items-center gap-1"
          >
            Details <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};
