import type { ReactNode } from "react";

type BadgeIconProps = {
  iconSlug: string;
  className?: string;
};

function IconFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 48 48"
    >
      <defs>
        <linearGradient id="badgeGradient" x1="8" x2="40" y1="6" y2="42">
          <stop offset="0%" stopColor="#204d8d" />
          <stop offset="100%" stopColor="#de7b3b" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" fill="url(#badgeGradient)" opacity="0.14" r="20" />
      <circle cx="24" cy="24" fill="white" fillOpacity="0.92" r="15" stroke="url(#badgeGradient)" strokeWidth="2" />
      {children}
    </svg>
  );
}

export function BadgeIcon({ iconSlug, className = "h-10 w-10" }: BadgeIconProps) {
  switch (iconSlug) {
    case "shield-medical":
      return <IconFrame className={className}><path d="M24 12l8 3v7c0 5-3.2 9.6-8 12-4.8-2.4-8-7-8-12v-7l8-3z" stroke="#204d8d" strokeWidth="2.4" /><path d="M24 18v12M18 24h12" stroke="#de7b3b" strokeLinecap="round" strokeWidth="2.4" /></IconFrame>;
    case "shield-biohazard":
      return <IconFrame className={className}><circle cx="24" cy="24" fill="#de7b3b" opacity="0.14" r="4" /><path d="M24 15c2 0 3.5 1.7 3.5 3.7 0 1.6-1 3-2.5 3.5M19.5 19c0-2 1.5-3.7 3.5-3.7M18 27.5c-1.8-.6-3-2.2-3-4 0-1.7 1.1-3.2 2.7-3.8M30 27.5c1.8-.6 3-2.2 3-4 0-1.7-1.1-3.2-2.7-3.8M20 29l-3.5 6M28 29l3.5 6M24 28.5V35" stroke="#204d8d" strokeLinecap="round" strokeWidth="2" /></IconFrame>;
    case "shield-scale":
      return <IconFrame className={className}><path d="M24 14v18M18 18h12M18 18l-3 5h6l-3-5zm12 0l-3 5h6l-3-5zM20 32h8" stroke="#204d8d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" /></IconFrame>;
    case "shield-chat":
      return <IconFrame className={className}><path d="M16 19.5c0-2 1.6-3.5 3.5-3.5h9c1.9 0 3.5 1.5 3.5 3.5v5c0 1.9-1.6 3.5-3.5 3.5H23l-4 4v-4h-.5c-1.9 0-3.5-1.6-3.5-3.5v-5z" stroke="#204d8d" strokeLinejoin="round" strokeWidth="2.2" /><path d="M20.5 22.5h7" stroke="#de7b3b" strokeLinecap="round" strokeWidth="2.2" /></IconFrame>;
    case "shield-heart":
      return <IconFrame className={className}><path d="M24 31s-6-3.5-6-8.2c0-2.4 1.8-4.3 4-4.3 1.2 0 2.3.6 3 1.6.7-1 1.8-1.6 3-1.6 2.2 0 4 1.9 4 4.3C30 27.5 24 31 24 31z" fill="#de7b3b" opacity="0.18" stroke="#204d8d" strokeWidth="2.1" /></IconFrame>;
    case "shield-care":
      return <IconFrame className={className}><path d="M17 20c0-2.2 1.8-4 4-4 1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.8 4 4 0 5.5-7 10-7 10s-7-4.5-7-10z" stroke="#204d8d" strokeWidth="2.2" /><path d="M24 18v8M20 22h8" stroke="#de7b3b" strokeLinecap="round" strokeWidth="2.2" /></IconFrame>;
    case "shield-pulse":
      return <IconFrame className={className}><path d="M16 25h5l2-5 3 10 2-5h4" stroke="#204d8d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" /></IconFrame>;
    case "shield-alert":
      return <IconFrame className={className}><path d="M24 15l8 14H16l8-14z" stroke="#204d8d" strokeLinejoin="round" strokeWidth="2.2" /><path d="M24 20v5M24 28h.01" stroke="#de7b3b" strokeLinecap="round" strokeWidth="2.3" /></IconFrame>;
    case "shield-document":
      return <IconFrame className={className}><path d="M20 15h6l4 4v14H18V15h2z" stroke="#204d8d" strokeLinejoin="round" strokeWidth="2.2" /><path d="M26 15v4h4M20.5 24h7M20.5 28h7" stroke="#de7b3b" strokeLinecap="round" strokeWidth="2.2" /></IconFrame>;
    case "shield-restore":
      return <IconFrame className={className}><path d="M24 16a8 8 0 108 8" stroke="#204d8d" strokeLinecap="round" strokeWidth="2.2" /><path d="M32 16v6h-6" stroke="#de7b3b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" /></IconFrame>;
    case "shield-lab":
      return <IconFrame className={className}><path d="M21 15v7l-4 7a2 2 0 001.8 3h10.4A2 2 0 0031 29l-4-7v-7" stroke="#204d8d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" /><path d="M20 26h8" stroke="#de7b3b" strokeLinecap="round" strokeWidth="2.2" /></IconFrame>;
    case "star-first":
    case "star-half":
    case "trophy":
    case "trophy-gold":
      return <IconFrame className={className}><path d="M24 15l2.8 5.6 6.2.9-4.5 4.4 1.1 6.1L24 29l-5.6 3 1.1-6.1-4.5-4.4 6.2-.9L24 15z" fill="#de7b3b" opacity="0.22" stroke="#204d8d" strokeLinejoin="round" strokeWidth="2" /></IconFrame>;
    case "flame-small":
    case "flame-large":
      return <IconFrame className={className}><path d="M27.5 17c.4 4-3.5 4.7-2.5 8 .4 1.4 1.8 2.5 1.8 4.5A5.8 5.8 0 0115.2 29c0-5.5 4.3-7.8 6.1-12 .4 2 1.3 3.1 2.4 3.1 1.7 0 1.7-2 3.8-3.1z" fill="#de7b3b" opacity="0.24" stroke="#204d8d" strokeLinejoin="round" strokeWidth="2" /></IconFrame>;
    case "arrow-return":
    case "arrow-up":
      return <IconFrame className={className}><path d="M18 27l6-6 6 6M24 21v11" stroke="#204d8d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" /></IconFrame>;
    case "check-circle":
      return <IconFrame className={className}><circle cx="24" cy="24" fill="#de7b3b" opacity="0.18" r="8" stroke="#204d8d" strokeWidth="2.2" /><path d="M20.5 24l2.2 2.2 4.8-5" stroke="#204d8d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" /></IconFrame>;
    case "lightning":
    case "lightning-bolt":
      return <IconFrame className={className}><path d="M26 14l-7 10h5l-2 10 7-10h-5l2-10z" fill="#de7b3b" opacity="0.24" stroke="#204d8d" strokeLinejoin="round" strokeWidth="2" /></IconFrame>;
    case "compass":
      return <IconFrame className={className}><circle cx="24" cy="24" r="9" stroke="#204d8d" strokeWidth="2.2" /><path d="M27.5 20.5l-2 6-6 2 2-6 6-2z" fill="#de7b3b" opacity="0.24" stroke="#204d8d" strokeLinejoin="round" strokeWidth="2" /></IconFrame>;
    case "globe":
      return <IconFrame className={className}><circle cx="24" cy="24" r="9" stroke="#204d8d" strokeWidth="2.2" /><path d="M15 24h18M24 15c2.5 2.5 2.5 15 0 18M24 15c-2.5 2.5-2.5 15 0 18" stroke="#de7b3b" strokeLinecap="round" strokeWidth="1.8" /></IconFrame>;
    default:
      return <IconFrame className={className}><circle cx="24" cy="24" fill="#de7b3b" opacity="0.18" r="7" stroke="#204d8d" strokeWidth="2.1" /></IconFrame>;
  }
}
