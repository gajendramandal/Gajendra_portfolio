'use client';

import { useState } from 'react';
import type { GalleryItem } from '@/lib/schemas';
import Lightbox from './Lightbox';

interface GalleryGridProps {
  items: GalleryItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <button
            key={`${item.title}-${index}`}
            onClick={() => setSelectedItem(item)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
            aria-label={`View ${item.title}`}
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Title overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-white text-sm font-medium truncate">{item.title}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedItem && (
        <Lightbox
          image={selectedItem.image}
          title={selectedItem.title}
          description={selectedItem.description}
          date={selectedItem.date}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
