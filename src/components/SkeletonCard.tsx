import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-video w-full bg-slate-100" />
      <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <div className="h-4 bg-slate-200 rounded w-2/3 mb-2.5" />
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-5/6" />
            <div className="h-3 bg-slate-100 rounded w-4/6" />
          </div>
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-3 bg-slate-100 rounded w-16" />
          <div className="h-3 bg-slate-100 rounded w-12" />
        </div>
      </div>
    </div>
  );
};

