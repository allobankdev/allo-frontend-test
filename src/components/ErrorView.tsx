import React from 'react';

interface ErrorViewProps {
  message?: string | null;
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ message, onRetry }) => {
  return (
    <div className="w-full max-w-lg mx-auto py-12 px-6 text-center border border-slate-200 bg-white rounded-lg">
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-mono text-sm font-semibold mb-3">
        !
      </div>
      <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-1">
        Communication Error
      </h3>
      <p className="text-xs text-slate-500 mb-6 font-mono leading-relaxed">
        {message || 'Unable to retrieve launcher configuration records.'}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors"
      >
        Retry Request
      </button>
    </div>
  );
};

