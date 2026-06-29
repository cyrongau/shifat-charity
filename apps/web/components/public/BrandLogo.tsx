'use client';

import React from 'react';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  light?: boolean;
}

export default function BrandLogo({ className = 'h-12', showText = true, light = false }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="shifat-brand-logo">
      {/* SVG Emblem representing the dual green-blue human figures forming a circle of health & trust */}
      <svg 
        viewBox="0 0 100 100" 
        className="h-10 w-10 flex-shrink-0"
        aria-hidden="true"
      >
        {/* White background / glowing shadow container */}
        <circle cx="50" cy="50" r="46" fill="transparent" />
        
        {/* Left Green Figure (representing community, hope, health) */}
        <path 
          d="M 32 37 C 32 30, 48 18, 48 10 C 48 10, 45 28, 41 40 C 37 52, 28 62, 28 72 C 28 82, 42 88, 50 88 C 42 88, 24 82, 20 70 C 16 58, 20 48, 28 42" 
          fill="#10b981" 
        />
        {/* Left Figure Head */}
        <circle cx="34" cy="35" r="5" fill="#047857" />

        {/* Right Blue Figure (representing trust, stability, care) */}
        <path 
          d="M 68 37 C 68 30, 52 18, 52 10 C 52 10, 55 28, 59 40 C 63 52, 72 62, 72 72 C 72 82, 58 88, 50 88 C 58 88, 76 82, 80 70 C 84 58, 80 48, 72 42" 
          fill="#0284c7" 
        />
        {/* Right Figure Head */}
        <circle cx="66" cy="35" r="5" fill="#0369a1" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display text-2xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-brand-charcoal'}`}>
            SH<span className="text-brand-green">i</span>FAT
          </span>
          <span className={`text-[8px] font-medium tracking-widest uppercase ${light ? 'text-gray-300' : 'text-gray-500'}`}>
            Mobilizing Communities For Development
          </span>
        </div>
      )}
    </div>
  );
}
