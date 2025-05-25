'use client';

import { Suspense } from 'react';
import RefreshPage from '@/components/refreshclient';

export default function RefreshPageWrapper() {
  return (
    <Suspense fallback={<p>Loading refresh...</p>}>
      <RefreshPage />
    </Suspense>
  );
}
