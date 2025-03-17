'use client';

import React from 'react';

export default function DeskAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full"
      >
        {/* Desk at more dramatic side angle - smaller size */}
        {/* Desktop surface */}
        <path
          d="M80,250 L280,250 L350,200 L150,200 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-accent"
        />
        {/* Left desk leg */}
        <path
          d="M80,250 L60,350 L40,300 L150,200"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-accent"
        />
        {/* Right desk leg */}
        <path
          d="M280,250 L300,350 L350,300 L350,200"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-accent"
        />

        {/* Monitors */}
        {/* Left Monitor */}
        <path
          d="M140,140 L220,140 L220,80 L140,80 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-secondary"
        />
        <path
          d="M180,140 L170,160"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-secondary"
        />
        <path
          d="M160,160 L180,160"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-secondary"
        />

        {/* Right Monitor */}
        <path
          d="M240,140 L320,140 L320,80 L240,80 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-secondary"
        />
        <path
          d="M280,140 L270,160"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-secondary"
        />
        <path
          d="M260,160 L280,160"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-secondary"
        />

        {/* Animated code lines - Left Monitor */}
        <line 
          x1="150" y1="90" 
          x2="210" y2="90"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary animate-type-1"
        />
        <line 
          x1="150" y1="100" 
          x2="190" y2="100"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary animate-type-2"
        />
        <line 
          x1="150" y1="110" 
          x2="200" y2="110"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary animate-type-3"
        />
        <line 
          x1="150" y1="120" 
          x2="180" y2="120"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary animate-type-4"
        />
        <line 
          x1="150" y1="130" 
          x2="205" y2="130"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary animate-type-5"
        />

        {/* Animated code lines - Right Monitor */}
        <line 
          x1="250" y1="90" 
          x2="310" y2="90"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary animate-type-6"
        />
        <line 
          x1="250" y1="100" 
          x2="290" y2="100"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary animate-type-7"
        />
        <line 
          x1="250" y1="110" 
          x2="300" y2="110"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary animate-type-8"
        />
        <line 
          x1="250" y1="120" 
          x2="280" y2="120"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary animate-type-9"
        />
        <line 
          x1="250" y1="130" 
          x2="305" y2="130"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary animate-type-10"
        />

        {/* Chair at steeper angle */}
        <path
          d="M160,280 L140,350 M220,280 L240,350"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-secondary"
        />
        <path
          d="M160,280 L220,280 L250,260 L190,260 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-secondary"
        />

        {/* Stick Figure from side view */}
        {/* Body (sitting position at steeper angle) */}
        <line 
          x1="190" y1="180" 
          x2="190" y2="250" 
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary"
        />
        
        {/* Head */}
        <circle 
          cx="190" 
          cy="160" 
          r="20" 
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary"
        />

        {/* Arms (bent at desk, showing more side view) */}
        <path
          d="M190,200 L160,220 L150,210"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary"
        />
        <path
          d="M190,200 L250,210 L270,200"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary"
        />

        {/* Legs (bent sitting position at steeper angle) */}
        <path
          d="M190,250 L160,270 L160,280"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary"
        />
        <path
          d="M190,250 L220,270 L220,280"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary"
        />
      </svg>
    </div>
  );
} 