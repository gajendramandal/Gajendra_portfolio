'use client';

import { useEffect, useRef, useCallback } from 'react';

interface LightboxProps {
  image: string;
  title: string;
  description?: string;
  date: string;
  onClose: () => void;
}

export default function Lightbox({ image, title, description, date, onClose }: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus the close button on open
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Focus trap: prevent Tab from leaving the lightbox
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on click outside image (backdrop click)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Lightbox: ${title}`}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute -top-2 -right-2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <img
          src={image}
          alt={title}
          className="max-h-[70vh] w-auto object-contain rounded-lg"
        />

        {/* Info below image */}
        <div className="mt-4 text-center text-white">
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && <p className="mt-1 text-gray-300 text-sm">{description}</p>}
          <p className="mt-1 text-gray-400 text-xs">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}
