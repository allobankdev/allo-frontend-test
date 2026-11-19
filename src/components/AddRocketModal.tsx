import React, { useState } from 'react';
import { useRocket } from '../context/RocketContext';

interface AddRocketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddRocketModal: React.FC<AddRocketModalProps> = ({ isOpen, onClose }) => {
  const { addRocket } = useRocket();

  const [formData, setFormData] = useState({
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    country_code: 'USA',
    maiden_flight: '',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      setErrorMsg('Rocket Name is required.');
      return;
    }

    addRocket({
      full_name: formData.full_name.trim(),
      description: formData.description.trim() || null,
      image_url: formData.image_url.trim() || null,
      launch_cost: formData.launch_cost ? Number(formData.launch_cost) : null,
      maiden_flight: formData.maiden_flight.trim() || null,
      manufacturer: {
        name: 'SpaceX',
        country_code: formData.country_code.trim() || null,
      },
    });

    setFormData({
      full_name: '',
      description: '',
      image_url: '',
      launch_cost: '',
      country_code: 'USA',
      maiden_flight: '',
    });
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden">
        <header className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
            Register Launcher Configuration
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-700 text-sm leading-none p-1"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Configuration Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              required
              placeholder="e.g. Starship Block 2"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Technical summary of the launch vehicle..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                placeholder="https://..."
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Launch Cost (USD)
              </label>
              <input
                type="number"
                name="launch_cost"
                placeholder="e.g. 50000000"
                min="0"
                value={formData.launch_cost}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono tabular-nums text-[11px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Country Code
              </label>
              <input
                type="text"
                name="country_code"
                placeholder="USA"
                maxLength={3}
                value={formData.country_code}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 uppercase font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Maiden Flight Date
              </label>
              <input
                type="date"
                name="maiden_flight"
                value={formData.maiden_flight}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
