<<<<<<< HEAD
// app/account/guest/customer/[id]/page.tsx

export default function CustomerPage({ params }: { params: { id: string } }) {
    return <div>고객 ID: {params.id}</div>;
  }
  
=======
"use client";

import { useParams } from 'next/navigation';
import React from 'react';

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div>
      <h1>Customer Detail Page</h1>
      <p>Customer ID: {id}</p>
    </div>
  );
}
>>>>>>> 321e26b098c22d142ea7139f04988629777611ac
