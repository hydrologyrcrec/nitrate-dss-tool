'use client';

import { Suspense } from 'react';
import RefreshPage from '@/components/RefreshClient';

export default function RefreshPageWrapper() {
  return (
    <Suspense fallback={<p>Loading refresh...</p>}>
      <RefreshPage />
    </Suspense>
  );
}
