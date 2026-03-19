'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const HeroLanding: React.FC = () => {
  const router = useRouter();

  const handleCtaClick = () => {
    router.push('/pricing/optimization');
  };

  return (
    <main className="max-h-screen hero-bg relative">
      <style>{`s
        /* ===============================
          GAMIFIED HERO BACKGROUND
        ================================ */
        .hero-bg {
          position: relative;
          isolation: isolate;
          background:
            radial-gradient(1200px 600px at 85% 20%, rgba(168,85,247,0.18), transparent 60%),
            radial-gradient(800px 400px at 15% 80%, rgba(255,107,157,0.14), transparent 55%),
            linear-gradient(180deg, #0B0616 0%, #120A24 45%, #0A0715 100%);
        }

        .hero-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle, rgba(168,85,247,0.95) 1px, transparent 1.8px),
            radial-gradient(circle, rgba(255,107,157,0.85) 1.2px, transparent 2.2px);
          background-size: 34px 34px, 58px 58px;
          background-position: 0 0, 18px 24px;
          opacity: 0.18;
          mix-blend-mode: screen;
          filter: drop-shadow(0 0 6px rgba(168,85,247,0.35));
        }

        .hero-bg::after {
          content: "";
          position: absolute;
          inset: -20%;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 50%, rgba(168,85,247,0.14), transparent 60%);
          animation: slowPulse 12s ease-in-out infinite;
          opacity: 0.75;
        }

        @keyframes slowPulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.06); opacity: 0.9; }
        }

        .scanlines {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.10;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.07) 0px,
            rgba(255,255,255,0.07) 1px,
            transparent 3px,
            transparent 7px
          );
          mix-blend-mode: overlay;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        /* ===============================
          MODERN LANDING UI
        ================================ */
        .glass-card {
          background: rgba(18, 10, 36, 0.6);
          border: 1px solid rgba(168,85,247,0.25);
          backdrop-filter: blur(10px);
          box-shadow: 0 14px 40px rgba(0,0,0,0.35);
        }

        .neon-border {
          position: relative;
        }
        .neon-border::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 16px;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(168,85,247,0.7),
            rgba(255,107,157,0.35),
            rgba(168,85,247,0.15)
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .pill {
          background: rgba(45, 37, 71, 0.5);
          border: 1px solid rgba(168,85,247,0.25);
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .pill:hover {
          background: rgba(45, 37, 71, 0.8);
          border-color: rgba(168,85,247,0.45);
        }

        .cta-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cta-button:hover {
          background-color: #9333EA;
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.4);
        }

        /* ===============================
          ABOVE-THE-FOLD LAYOUT HELPERS
        ================================ */
        .above-fold {
          min-height: 100svh; /* modern viewport units (better on mobile) */
          display: flex;
          flex-direction: column;
        }

        /* Horizontal bento rail on md+ keeps height compact */
        .bento-rail {
          display: grid;
          gap: 14px;
        }
        @media (min-width: 768px) {
          .bento-rail {
            display: flex;
            gap: 14px;
            overflow-x: auto;
            padding-bottom: 6px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .bento-rail::-webkit-scrollbar { height: 8px; }
          .bento-rail::-webkit-scrollbar-thumb {
            background: rgba(168,85,247,0.35);
            border-radius: 999px;
          }
        }

        .bento-card {
          scroll-snap-align: start;
          min-width: 0;
        }
        @media (min-width: 768px) {
          .bento-card {
            min-width: 280px;
            max-width: 340px;
            flex: 0 0 auto;
          }
        }
      `}</style>

      <div className="scanlines" aria-hidden="true" />

      {/* ===============================
          ABOVE THE FOLD: HERO + PILLS + BENTO (no forced vertical scroll on desktop)
      ================================ */}
      <section className="hero-content above-fold">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col py-10 md:py-12">
          {/* Top Row: Copy + Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center flex-1">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[#F5F1FF]">
                Turning <span className="text-[#A855F7]">'Ay sayang'</span> into{' '}
                <span className="text-[#FF6B9D]">'Uy, sale!'</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#B8A3D9] leading-relaxed">
                Maximize profit and minimize waste with agentic AI
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={handleCtaClick}
                  className="cta-button px-8 py-4 bg-[#A855F7] text-white rounded-lg font-semibold shadow-md hover:shadow-lg focus:outline-none"
                >
                  Let's get started
                </button>

                <span className="text-sm text-[#B8A3D9]">
                  ⚡ Fast setup • 🎯 Guardrails • 🏆 Scoreboard outcomes
                </span>
              </div>

              {/* Pills moved INSIDE hero so they don't get pushed down as a separate section */}
              <div className="flex flex-wrap gap-3 pt-3">
                {[
                  'Agentic AI pricing',
                  'Smart markdown timing',
                  'Retail-ready outputs',
                  'Reduce waste & overstock',
                ].map((text) => (
                  <span key={text} className="pill rounded-full px-4 py-2 text-sm text-[#E9D9FF]">
                    ✦ {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Image: constrained so 1024x1024 won't eat the fold */}
            <div className="flex justify-center md:justify-end">
              <img
                src="/sale_basket.png"
                alt="Shopping basket with sale tag"
                className="
                  w-full max-w-[420px] lg:max-w-[520px]
                  h-auto object-contain
                  md:max-h-[44vh] lg:max-h-[48vh]
                  select-none pointer-events-none
                  drop-shadow-[0_20px_60px_rgba(168,85,247,0.25)]
                "
                loading="eager"
                decoding="async"
                draggable={false}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  console.warn('Image not found at /sale_basket.png');
                }}
              />
            </div>
          </div>

          {/* Bottom Area: Bento rail anchored near bottom on desktop */}
          <div className="mt-8 md:mt-6">
            <div className="flex items-end justify-between gap-4 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F1FF]">
                Make pricing a game you can win
              </h2>
              <span className="hidden md:inline text-sm text-[#B8A3D9]">
                Swipe → (on desktop, scroll horizontally)
              </span>
            </div>

            {/* Bento becomes a horizontal rail on md+ to avoid vertical overflow */}
            <div className="bento-rail">
              <div className="bento-card glass-card neon-border p-5 rounded-2xl">
                <h3 className="text-base font-semibold text-white">
                  Smart actions, fully explained
                </h3>
                <p className="mt-2 text-sm text-[#B8A3D9]">
                  Recommendations with context so teams trust the move.
                </p>
              </div>

              <div className="bento-card glass-card neon-border p-5 rounded-2xl">
                <h3 className="text-base font-semibold text-white">Fast setup</h3>
                <p className="mt-2 text-sm text-[#B8A3D9]">
                  Plug data → set rules → optimize.
                </p>
              </div>

              <div className="bento-card glass-card neon-border p-5 rounded-2xl">
                <h3 className="text-base font-semibold text-white">Guardrails</h3>
                <p className="mt-2 text-sm text-[#B8A3D9]">
                  Floors, ceilings, and safety controls built-in.
                </p>
              </div>

              <div className="bento-card glass-card neon-border p-5 rounded-2xl">
                <h3 className="text-base font-semibold text-white">
                  Track outcomes like a scoreboard
                </h3>
                <p className="mt-2 text-sm text-[#B8A3D9]">
                  Monitor margin uplift, sell-through, and waste reduction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* If you add more sections later, put them BELOW here.
          On small screens the above-fold will naturally scroll and still looks good. */}
    </main>
  );
};

export default HeroLanding;