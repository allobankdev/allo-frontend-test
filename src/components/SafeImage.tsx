import React, { useState } from 'react';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const isUnavailable = !src || hasError;

  if (isUnavailable) {
    return (
      <div
        className={`bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-medium tracking-wide uppercase select-none ${containerClassName}`}
      >
        <span>No Image Available</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-slate-100 relative ${containerClassName}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
    </div>
  );
};
