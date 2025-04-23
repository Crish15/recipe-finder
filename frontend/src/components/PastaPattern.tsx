import React from 'react'

const PastaPattern: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full -z-10 opacity-20" aria-hidden="true">
    <defs>
      <pattern id="pasta-plate" width="64" height="64" patternUnits="userSpaceOnUse">
        {/* Piatto */}
        <ellipse cx="32" cy="40" rx="24" ry="12" fill="#fff" stroke="#DF3062" strokeWidth="2" />
        {/* Pasta (spaghetti) */}
        <ellipse cx="32" cy="36" rx="16" ry="6" fill="#F5B935" opacity="0.85" />
        <ellipse cx="32" cy="36" rx="12" ry="4" fill="#F5B935" opacity="0.7" />
        {/* Sugo: macchie rosse sopra la pasta */}
        <ellipse cx="28" cy="34" rx="3" ry="1.5" fill="#DF3062" opacity="0.8" />
        <ellipse cx="36" cy="37" rx="2.5" ry="1.2" fill="#DF3062" opacity="0.7" />
        <ellipse cx="32" cy="32" rx="2" ry="1" fill="#DF3062" opacity="0.6" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pasta-plate)" />
  </svg>
)

export default PastaPattern
