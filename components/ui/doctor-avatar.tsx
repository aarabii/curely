import React from "react";

interface DoctorAvatarProps {
  id: number;
  specialist: string;
  size?: number;
  className?: string;
}

/**
 * DoctorAvatar - Generative SVG Avatar Component
 *
 * Creates unique, minimalist, professional avatars for AI doctors
 * using a combination of shapes, gradients, and the design system palette.
 */
export function DoctorAvatar({
  id,
  specialist,
  size = 280,
  className = "",
}: DoctorAvatarProps) {
  // Generate deterministic colors based on doctor ID
  const colors = [
    "hsl(312, 100%, 50%)", // Primary - Magenta
    "hsl(168, 100%, 50%)", // Accent - Cyan
    "hsl(274, 100%, 50%)", // Purple
    "hsl(186, 100%, 50%)", // Teal
    "hsl(54, 100%, 50%)", // Yellow
    "hsl(14, 100%, 50%)", // Orange
    "hsl(217, 27%, 94%)", // Foreground
  ];

  // Deterministic pattern selection
  const patternIndex = id % 5;
  const colorPrimary = colors[(id - 1) % colors.length];
  const colorSecondary = colors[(id + 1) % colors.length];
  const colorAccent = colors[(id + 3) % colors.length];

  const gradientId = `gradient-${id}`;
  const patternId = `pattern-${id}`;

  const renderPattern = () => {
    switch (patternIndex) {
      case 0:
        // Circular composition - General Physician style
        return (
          <>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size * 0.35}
              fill={`url(#${gradientId})`}
              opacity="0.9"
            />
            <circle
              cx={size * 0.3}
              cy={size * 0.35}
              r={size * 0.12}
              fill={colorAccent}
              opacity="0.7"
            />
            <circle
              cx={size * 0.7}
              cy={size * 0.65}
              r={size * 0.15}
              fill={colorSecondary}
              opacity="0.6"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size * 0.25}
              fill="none"
              stroke={colorAccent}
              strokeWidth="3"
              opacity="0.5"
            />
          </>
        );
      case 1:
        // Geometric triangles - Pediatrician style
        return (
          <>
            <polygon
              points={`${size / 2},${size * 0.2} ${size * 0.2},${size * 0.7} ${
                size * 0.8
              },${size * 0.7}`}
              fill={`url(#${gradientId})`}
              opacity="0.85"
            />
            <polygon
              points={`${size * 0.4},${size * 0.5} ${size * 0.6},${
                size * 0.5
              } ${size / 2},${size * 0.75}`}
              fill={colorAccent}
              opacity="0.7"
            />
            <circle
              cx={size / 2}
              cy={size * 0.35}
              r={size * 0.08}
              fill={colorSecondary}
            />
          </>
        );
      case 2:
        // Rounded rectangles - Dermatologist style
        return (
          <>
            <rect
              x={size * 0.25}
              y={size * 0.25}
              width={size * 0.5}
              height={size * 0.5}
              rx={size * 0.08}
              fill={`url(#${gradientId})`}
              opacity="0.9"
            />
            <rect
              x={size * 0.35}
              y={size * 0.15}
              width={size * 0.3}
              height={size * 0.3}
              rx={size * 0.05}
              fill={colorAccent}
              opacity="0.6"
            />
            <rect
              x={size * 0.45}
              y={size * 0.55}
              width={size * 0.25}
              height={size * 0.25}
              rx={size * 0.04}
              fill={colorSecondary}
              opacity="0.7"
            />
          </>
        );
      case 3:
        // Abstract waves - Psychologist style
        return (
          <>
            <path
              d={`M 0,${size * 0.4} Q ${size * 0.25},${size * 0.2} ${
                size / 2
              },${size * 0.4} T ${size},${
                size * 0.4
              } L ${size},${size} L 0,${size} Z`}
              fill={`url(#${gradientId})`}
              opacity="0.85"
            />
            <path
              d={`M 0,${size * 0.6} Q ${size * 0.25},${size * 0.4} ${
                size / 2
              },${size * 0.6} T ${size},${
                size * 0.6
              } L ${size},${size} L 0,${size} Z`}
              fill={colorAccent}
              opacity="0.6"
            />
            <circle
              cx={size / 2}
              cy={size * 0.3}
              r={size * 0.1}
              fill={colorSecondary}
              opacity="0.8"
            />
          </>
        );
      case 4:
        // Hexagonal modern - Cardiologist style
        return (
          <>
            <polygon
              points={`${size / 2},${size * 0.15} ${size * 0.75},${
                size * 0.3
              } ${size * 0.75},${size * 0.6} ${size / 2},${size * 0.75} ${
                size * 0.25
              },${size * 0.6} ${size * 0.25},${size * 0.3}`}
              fill={`url(#${gradientId})`}
              opacity="0.9"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size * 0.15}
              fill={colorAccent}
              opacity="0.7"
            />
            <polygon
              points={`${size / 2},${size * 0.35} ${size * 0.6},${
                size * 0.45
              } ${size * 0.6},${size * 0.55} ${size / 2},${size * 0.65} ${
                size * 0.4
              },${size * 0.55} ${size * 0.4},${size * 0.45}`}
              fill={colorSecondary}
              opacity="0.6"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl"
        style={{ background: "hsl(var(--card))" }}
      >
        <defs>
          {/* Gradient definition */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorPrimary} stopOpacity="1" />
            <stop offset="50%" stopColor={colorSecondary} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colorAccent} stopOpacity="0.8" />
          </linearGradient>

          {/* Background pattern */}
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="20" cy="20" r="1.5" fill={colorPrimary} opacity="0.1" />
          </pattern>
        </defs>

        {/* Background pattern layer */}
        <rect width={size} height={size} fill={`url(#${patternId})`} />

        {/* Main avatar pattern */}
        <g>{renderPattern()}</g>

        {/* Optional specialist icon indicator */}
        <circle
          cx={size * 0.85}
          cy={size * 0.85}
          r={size * 0.08}
          fill="hsl(var(--primary))"
          opacity="0.9"
        />
        <text
          x={size * 0.85}
          y={size * 0.88}
          textAnchor="middle"
          fontSize={size * 0.08}
          fill="hsl(var(--primary-foreground))"
          fontWeight="bold"
        >
          {specialist.charAt(0)}
        </text>
      </svg>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
    </div>
  );
}

export default DoctorAvatar;
