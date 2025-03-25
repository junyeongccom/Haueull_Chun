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
