'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const slides = [
  { src: '/images/hero1.jpg', alt: 'Futsal match action 1' },
  { src: '/images/hero2.jpg', alt: 'Futsal match action 2' },
  { src: '/images/hero3.jpg', alt: 'Futsal match action 3' },
  { src: '/images/hero4.jpg', alt: 'Futsal match action 4' },
];

interface HeroSliderProps {
  siteName: string;
  courtsCount: number;
  avgRating: string;
  leaguesCount: number;
}

export default function HeroSlider({ siteName, courtsCount, avgRating, leaguesCount }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((idx: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 400);
  }, []);

  // Auto-advance every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [current, goTo]);

  return (
    <section style={{ position: 'relative', height: '90vh', minHeight: 540, maxHeight: 820, overflow: 'hidden', background: '#0d1117' }}>

      {/* Slides */}
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            opacity: i === current ? (fading ? 0 : 0.55) : 0,
            transition: 'opacity 0.6s ease-in-out',
          }}
        />
      ))}

      {/* Dark gradient scrim */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.92) 100%)', zIndex: 1 }} />

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2, padding: '0 40px 44px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>

            {/* Big title */}
            <div>
              <p style={{ fontSize: 12, color: '#4ADE80', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
                Platform Booking Futsal
              </p>
              <h1 style={{ fontSize: 'clamp(52px, 7vw, 92px)', fontWeight: 900, color: '#ffffff', lineHeight: 0.93, letterSpacing: '-3px', textTransform: 'uppercase', marginBottom: 28 }}>
                BOOKING<br />
                <span style={{ color: '#4ADE80' }}>LAPANGAN</span><br />
                FUTSAL
              </h1>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/courts" style={{ background: '#16A34A', color: '#fff', fontWeight: 700, fontSize: 14, padding: '13px 28px', borderRadius: 10, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 14px rgba(22,163,74,0.5)' }}>
                  Booking Sekarang
                </Link>
                <Link href="/courts" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, fontSize: 14, padding: '13px 24px', borderRadius: 10, textDecoration: 'none', display: 'inline-block', border: '1.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                  Lihat Lapangan
                </Link>
              </div>
            </div>

            {/* Stats + dot nav stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 20 }}>


              {/* Slide dots */}
              <div style={{ display: 'flex', gap: 8 }}>
                {slides.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}
                    style={{
                      width: i === current ? 28 : 8, height: 8, borderRadius: 99,
                      background: i === current ? '#4ADE80' : 'rgba(255,255,255,0.35)',
                      border: 'none', cursor: 'pointer', padding: 0,
                      transition: 'all 0.35s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
