import React from 'react';
import { Leaf, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

export default function BrandPillars() {
  const pillars = [
    {
      icon: <Leaf size={24} color="#1E8E3E" />,
      bg: "var(--google-green-surface)",
      title: "100% Organic Cotton",
      desc: "GOTS-certified combed ring-spun fibers grown without synthetic pesticides or petrochemicals."
    },
    {
      icon: <Truck size={24} color="#1A73E8" />,
      bg: "var(--google-blue-surface)",
      title: "Carbon Neutral Shipping",
      desc: "100% offset logistics powered by verified global reforestation and direct-air carbon capture."
    },
    {
      icon: <ShieldCheck size={24} color="#F9AB00" />,
      bg: "var(--google-yellow-surface)",
      title: "Ethically Crafted",
      desc: "Fair-trade certified heritage facilities across Portugal, Italy, and Japan paying 2.5x living wages."
    },
    {
      icon: <RefreshCw size={24} color="#D93025" />,
      bg: "var(--google-red-surface)",
      title: "Lifetime Seam Guarantee",
      desc: "Every garment is built for circular longevity. Free repair or circular recycling on all seams."
    }
  ];

  return (
    <section id="brand-pillars" style={{
      maxWidth: '1280px',
      margin: '0 auto 48px auto',
      padding: '0 24px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {pillars.map((pillar, idx) => (
          <div
            key={idx}
            className="card-google"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: pillar.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {pillar.icon}
            </div>

            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {pillar.title}
              </h3>
              <p style={{
                fontSize: '13.5px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}>
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
