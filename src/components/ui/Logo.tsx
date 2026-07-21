interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ab-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0066FF" />
            <stop offset="1" stopColor="#FF6B00" />
          </linearGradient>
          <linearGradient id="ab-a" x1="0" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0066FF" />
            <stop offset="1" stopColor="#337EFF" />
          </linearGradient>
          <linearGradient id="ab-b" x1="24" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF8C33" />
            <stop offset="1" stopColor="#FF6B00" />
          </linearGradient>
        </defs>

        {/* Rounded square background with full gradient */}
        <rect width="48" height="48" rx="12" fill="url(#ab-gradient)" opacity="0.12" />

        {/* Letter A — left, blue */}
        <path
          d="M14 36L20 12L26 36M16.5 28H23.5"
          stroke="url(#ab-a)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Letter B — right, orange, overlapping */}
        <path
          d="M28 12V36M28 12H34C36.2 12 38 13.8 38 16C38 18.2 36.2 20 34 20H28M28 24H35C37.2 24 39 25.8 39 28C39 30.2 37.2 32 35 32H28"
          stroke="url(#ab-b)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function LogoFull({ size = 40, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo size={size} />
      <div>
        <span className="font-display font-bold text-lg text-white tracking-tight">AB.TECHNILOGIE</span>
        <p className="text-[10px] text-dark-200 -mt-1 tracking-widest uppercase">Niamey, Niger</p>
      </div>
    </div>
  );
}
