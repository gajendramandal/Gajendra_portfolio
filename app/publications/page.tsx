import type { Metadata } from 'next';
import { getPublications } from '@/lib/data';
import PublicationsClient from './PublicationsClient';

export const metadata: Metadata = {
  title: 'Publications | Gajendra Mandal',
  description: 'Academic publications in journals, conferences, and workshops by Gajendra Mandal.',
  openGraph: {
    title: 'Publications | Gajendra Mandal',
    description: 'Academic publications in journals, conferences, and workshops by Gajendra Mandal.',
  },
};

export default function PublicationsPage() {
  const publications = getPublications();

  return <PublicationsClient publications={publications} />;
}
