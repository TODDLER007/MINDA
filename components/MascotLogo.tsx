
import React from 'react';

interface MascotLogoProps {
  className?: string;
  size?: number;
}

const MascotLogo: React.FC<MascotLogoProps> = ({ className = "", size = 100 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 400 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        {/* Glow Effect */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff9fcc" />
            <stop offset="100%" stopColor="#ff5ea6" />
          </linearGradient>
          <linearGradient id="headGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff85a1" />
            <stop offset="100%" stopColor="#ff3d68" />
          </linearGradient>
        </defs>

        {/* Body */}
        <path d="M140 340C140 340 120 400 200 400C280 400 260 340 260 340H140Z" fill="white" stroke="#333" strokeWidth="4" />
        <path d="M160 360C160 360 170 380 200 380C230 380 240 360 240 360" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" />

        {/* Head Base */}
        <circle cx="200" cy="220" r="110" fill="white" stroke="#333" strokeWidth="4" />
        
        {/* Glass Dome */}
        <path d="M100 180C100 124.772 144.772 80 200 80C255.228 80 300 124.772 300 180C300 185 300 190 300 190H100C100 190 100 185 100 180Z" fill="url(#headGrad)" stroke="#333" strokeWidth="4" />
        
        {/* Brain */}
        <g transform="translate(135, 110) scale(0.65)">
          <path d="M50 80C22.3858 80 0 57.6142 0 30C0 13.4315 13.4315 0 30 0C35 0 40 1.5 44 4C48 1.5 53 0 58 0C74.5685 0 88 13.4315 88 30C88 57.6142 65.6142 80 38 80H50Z" fill="url(#brainGrad)" />
          <path d="M150 80C122.386 80 100 57.6142 100 30C100 13.4315 113.431 0 130 0C135 0 140 1.5 144 4C148 1.5 153 0 158 0C174.569 0 188 13.4315 188 30C188 57.6142 165.614 80 138 80H150Z" fill="url(#brainGrad)" />
          <path d="M94 20V90" stroke="#ff3d68" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* Ears/Headphones */}
        <rect x="70" y="200" width="30" height="60" rx="15" fill="white" stroke="#333" strokeWidth="4" />
        <rect x="300" y="200" width="30" height="60" rx="15" fill="white" stroke="#333" strokeWidth="4" />

        {/* Eyes */}
        <circle cx="160" cy="245" r="18" fill="#333" />
        <circle cx="156" cy="240" r="5" fill="white" />
        <circle cx="240" cy="245" r="18" fill="#333" />
        <circle cx="236" cy="240" r="5" fill="white" />

        {/* Mouth */}
        <path d="M185 275C185 275 190 290 200 290C210 290 215 275 215 275" stroke="#ff3d68" strokeWidth="8" strokeLinecap="round" />

        {/* Antenna & Heart */}
        <path d="M200 80V40" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        <path d="M200 40C200 40 185 20 200 5C215 20 200 40 200 40Z" fill="url(#heartGrad)" stroke="#333" strokeWidth="2" />

        {/* Sparkles */}
        <path d="M340 100L345 115L360 120L345 125L340 140L335 125L320 120L335 115L340 100Z" fill="#7ed9ff" />
        <path d="M60 140L63 150L73 153L63 156L60 166L57 156L47 153L57 150L60 140Z" fill="#ff9fcc" />
        <circle cx="320" cy="180" r="8" fill="#7ed9ff" opacity="0.6" />
        <circle cx="90" cy="100" r="6" fill="#ff9fcc" opacity="0.6" />
      </svg>
    </div>
  );
};

export default MascotLogo;
