/**
 * Jeu d'icônes de la marque — trait de 1,75, extrémités arrondies, grille
 * 24. Dessiné pour la landing, partagé avec l'application depuis
 * l'unification des chartes : la navigation tournait sur des emoji
 * (🏠 🗺️ 🗝️ 👤), rendus différemment sur chaque système et étrangers au
 * reste de l'interface.
 */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Svg({ children, ...rest }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowUpRight = (p: P) => (
  <Svg {...p}>
    <path d="M7 17 17 7" />
    <path d="M7.5 7H17v9.5" />
  </Svg>
);

export const ArrowRight = (p: P) => (
  <Svg {...p}>
    <path d="M4.5 12h15" />
    <path d="m13 5.5 6.5 6.5-6.5 6.5" />
  </Svg>
);

export const Play = (p: P) => (
  <Svg {...p}>
    <path d="M8.5 5.6 18 12l-9.5 6.4z" fill="currentColor" strokeWidth={1.4} />
  </Svg>
);

export const Clock = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.2V12l3.2 2" />
  </Svg>
);

export const Smartphone = (p: P) => (
  <Svg {...p}>
    <rect x="6.8" y="2.4" width="10.4" height="19.2" rx="2.6" />
    <path d="M10.8 18.6h2.4" />
  </Svg>
);

export const CreditCard = (p: P) => (
  <Svg {...p}>
    <rect x="2.6" y="5.2" width="18.8" height="13.6" rx="2.6" />
    <path d="M2.6 10h18.8" />
    <path d="M6.4 14.6h3.4" />
  </Svg>
);

export const TrendUp = (p: P) => (
  <Svg {...p}>
    <path d="M3.4 16.8 9.2 11l3.8 3.8 7.6-7.6" />
    <path d="M15.4 7.2h5.2v5.2" />
  </Svg>
);

export const Banknote = (p: P) => (
  <Svg {...p}>
    <rect x="2.6" y="6" width="18.8" height="12" rx="2.4" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6.2 9.6v4.8M17.8 9.6v4.8" />
  </Svg>
);

export const Globe = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M3.4 12h17.2" />
    <path d="M12 3.4a13.4 13.4 0 0 1 0 17.2 13.4 13.4 0 0 1 0-17.2Z" />
  </Svg>
);

export const Compass = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1z" />
  </Svg>
);

export const ShieldAlert = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.2 19.2 6v5.6c0 4.3-3 7.9-7.2 9.2-4.2-1.3-7.2-4.9-7.2-9.2V6z" />
    <path d="M12 8.8v4" />
    <path d="M12 16.1h.01" />
  </Svg>
);

export const Wallet = (p: P) => (
  <Svg {...p}>
    <path d="M3.2 8V7.2a2.4 2.4 0 0 1 2.4-2.4h10.6" />
    <rect x="3.2" y="8" width="17.6" height="11.2" rx="2.6" />
    <path d="M16.6 13.6h.6" />
  </Svg>
);

export const Trophy = (p: P) => (
  <Svg {...p}>
    <path d="M8 3.6h8V9a4 4 0 0 1-8 0z" />
    <path d="M8 5.4H5.4a2.6 2.6 0 0 0 2.7 4.2" />
    <path d="M16 5.4h2.6a2.6 2.6 0 0 1-2.7 4.2" />
    <path d="M12 13v3.4" />
    <path d="M8.8 20.4h6.4" />
  </Svg>
);

export const Scale = (p: P) => (
  <Svg {...p}>
    <path d="M12 4.2v16.2" />
    <path d="M7.4 20.4h9.2" />
    <path d="M4 8.2h16" />
    <path d="M5.4 8.2 2.9 13.6a2.8 2.8 0 0 0 5 0z" />
    <path d="M18.6 8.2 16.1 13.6a2.8 2.8 0 0 0 5 0z" />
  </Svg>
);

export const Target = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <circle cx="12" cy="12" r="4.4" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </Svg>
);

export const Calendar = (p: P) => (
  <Svg {...p}>
    <rect x="3.4" y="5" width="17.2" height="15.6" rx="2.6" />
    <path d="M3.4 9.8h17.2" />
    <path d="M8.2 3v4M15.8 3v4" />
  </Svg>
);

export const Headset = (p: P) => (
  <Svg {...p}>
    <path d="M4.2 13.4v-1.2a7.8 7.8 0 0 1 15.6 0v1.2" />
    <rect x="2.4" y="12.8" width="4" height="6.2" rx="2" />
    <rect x="17.6" y="12.8" width="4" height="6.2" rx="2" />
    <path d="M19.6 19v.4a2.8 2.8 0 0 1-2.8 2.8H13.4" />
  </Svg>
);

export const CheckCircle = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="m8.2 12.3 2.6 2.6 5-5.4" />
  </Svg>
);

export const XCircle = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6" />
  </Svg>
);

export const Check = (p: P) => (
  <Svg {...p}>
    <path d="m4.8 12.4 4.8 4.8L19.2 6.8" />
  </Svg>
);

export const Shield = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.2 19.2 6v5.6c0 4.3-3 7.9-7.2 9.2-4.2-1.3-7.2-4.9-7.2-9.2V6z" />
    <path d="m8.9 12.1 2.2 2.2 4.1-4.4" />
  </Svg>
);

export const Frame = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="4.6" width="18" height="14.8" rx="2.6" />
    <circle cx="8.6" cy="10" r="1.5" />
    <path d="m4.2 17.4 4.8-4.4 3.8 3.4 2.9-2.4 4.1 3.4" />
  </Svg>
);

export const Award = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="8.8" r="5.4" />
    <path d="m8.7 13.6-1.5 7.2 4.8-2.6 4.8 2.6-1.5-7.2" />
  </Svg>
);

export const BookOpen = (p: P) => (
  <Svg {...p}>
    <path d="M3.2 5.4h5.4a3.4 3.4 0 0 1 3.4 3.4v11a2.8 2.8 0 0 0-2.8-2.4H3.2z" />
    <path d="M20.8 5.4h-5.4A3.4 3.4 0 0 0 12 8.8v11a2.8 2.8 0 0 1 2.8-2.4h6z" />
  </Svg>
);

/* ---------- Navigation de l'application ---------- */

export const Home = (p: P) => (
  <Svg {...p}>
    <path d="M3.6 10.2 12 3.6l8.4 6.6" />
    <path d="M5.6 8.9v10.3a1.2 1.2 0 0 0 1.2 1.2h10.4a1.2 1.2 0 0 0 1.2-1.2V8.9" />
    <path d="M9.8 20.4v-5.6h4.4v5.6" />
  </Svg>
);

export const Map = (p: P) => (
  <Svg {...p}>
    <path d="M9 4.2 3.4 6.4v13.4L9 17.6l6 2.6 5.6-2.2V4.6L15 6.8z" />
    <path d="M9 4.2v13.4M15 6.8v13.4" />
  </Svg>
);

export const Vault = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="4.4" width="18" height="15.2" rx="2.6" />
    <circle cx="11" cy="12" r="3.4" />
    <path d="M11 8.6V6.9M11 17.1v-1.7M14.4 12h1.7M6.2 12h1.4" />
  </Svg>
);

export const User = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="8.4" r="3.9" />
    <path d="M4.8 20.4a7.2 7.2 0 0 1 14.4 0" />
  </Svg>
);

export const LogOut = (p: P) => (
  <Svg {...p}>
    <path d="M14.2 4.4H6.6a1.8 1.8 0 0 0-1.8 1.8v11.6a1.8 1.8 0 0 0 1.8 1.8h7.6" />
    <path d="M17.4 8.6 20.8 12l-3.4 3.4" />
    <path d="M20.4 12h-9.8" />
  </Svg>
);

export const Flame = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.2s4.9 3.3 4.9 8a4.9 4.9 0 0 1-9.8 0c0-1.7.8-3 1.6-3.9.2 1.4 1 2.2 1.8 2.2 1.2 0 1.9-1.3 1.5-6.3Z" />
  </Svg>
);

export const Close = (p: P) => (
  <Svg {...p}>
    <path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" />
  </Svg>
);

export const Bell = (p: P) => (
  <Svg {...p}>
    <path d="M18 9.4a6 6 0 1 0-12 0c0 5-2.2 6.4-2.2 6.4h16.4S18 14.4 18 9.4" />
    <path d="M13.6 19.4a1.9 1.9 0 0 1-3.2 0" />
  </Svg>
);
