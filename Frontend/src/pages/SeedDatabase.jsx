import React, { useState } from 'react';
import { seedAllData } from '../firebase/seedData';

const SeedDatabase = () => {
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setStatus(['⏳ Starting seed...']);
    try {
      const results = await seedAllData((msg) => {
        setStatus((prev) => [...prev, msg]);
      });
      setStatus((prev) => [...prev, '', '🎉 Seeding complete!']);
    } catch (error) {
      setStatus((prev) => [...prev, `❌ Error: ${error.message}`]);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Seed Firestore Database</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        This will populate your Firestore with services, bundles, combos, promo codes, and sample slots.
        It only seeds collections that are empty — safe to run multiple times.
      </p>
      <button
        onClick={handleSeed}
        disabled={loading}
        style={{
          padding: '12px 24px',
          background: loading ? '#ccc' : '#8dcae4',
          color: '#1a1a1a',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Seeding...' : 'Seed Database'}
      </button>
      {status.length > 0 && (
        <div style={{ marginTop: '20px', padding: '16px', background: '#f4f7fb', borderRadius: '8px' }}>
          {status.map((msg, i) => (
            <p key={i} style={{ margin: '4px 0', fontSize: '14px' }}>{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeedDatabase;
