import React from 'react';
import { Map } from 'lucide-react';

export default function PlanningPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '3rem', background: '#050505', color: '#fff' }}>
      <h1 style={{ fontFamily: 'NinjaNaruto', color: '#ff6600', fontSize: '2.5rem' }}>
        <Map style={{ marginRight: '10px' }} /> Estratégia de Guerra
      </h1>
      <p style={{ color: '#888', marginTop: '10px' }}>Roteiros, anotações e segredos da campanha.</p>
    </div>
  );
}