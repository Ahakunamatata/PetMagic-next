'use client';

import React from 'react';

/**
 * Uiverse loading animation
 * Source: https://uiverse.io/rillala/nice-robin-83
 *
 * Notes:
 * - Implemented as plain divs + Tailwind arbitrary values + inline keyframes.
 * - Styles are scoped via a unique class prefix to avoid collisions.
 */
export default function UiverseLoadingRobin({
  className,
  label = 'Loading',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div className={['pm-robin-loader', className].filter(Boolean).join(' ')} aria-label={label} role="status">
      <div className="pm-robin-shadow" />
      <div className="pm-robin-box" />

      <style jsx>{`
        .pm-robin-loader {
          width: 45px;
          height: 45px;
          position: relative;
          margin: 0 auto;
        }

        .pm-robin-shadow {
          width: 45px;
          height: 5px;
          background: rgba(0, 0, 0, 0.18);
          position: absolute;
          top: 49px;
          left: 0;
          border-radius: 50%;
          animation: pm-robin-shadow 0.5s linear infinite;
        }

        .pm-robin-box {
          width: 45px;
          height: 45px;
          background: #3b82f6; /* tailwind blue-500 */
          animation: pm-robin-animate 0.5s linear infinite;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 3px;
        }

        @keyframes pm-robin-animate {
          17% {
            border-bottom-right-radius: 3px;
          }
          25% {
            transform: translateY(9px) rotate(22.5deg);
          }
          50% {
            transform: translateY(18px) scale(1, 0.9) rotate(45deg);
            border-bottom-right-radius: 40px;
          }
          75% {
            transform: translateY(9px) rotate(67.5deg);
          }
          100% {
            transform: translateY(0) rotate(90deg);
          }
        }

        @keyframes pm-robin-shadow {
          50% {
            transform: scale(1.2, 1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pm-robin-shadow,
          .pm-robin-box {
            animation: none;
          }
        }
      `}</style>

      <span className="sr-only">{label}</span>
    </div>
  );
}
