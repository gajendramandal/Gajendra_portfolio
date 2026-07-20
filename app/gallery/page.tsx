import type { Metadata } from 'next';
import { getGalleryItems } from '@/lib/data';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Gallery | Gajendra Mandal',
  description: 'Browse photos of campus life, research lab, and personal moments.',
  openGraph: {
    title: 'Gallery | Gajendra Mandal',
    description: 'Browse photos of campus life, research lab, and personal moments.',
  },
};

export default function GalleryPage() {
  const galleryItems = getGalleryItems();

  return <GalleryClient items={galleryItems} />;
}
