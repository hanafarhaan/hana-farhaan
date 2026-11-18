import type { ReactNode, SVGProps } from "react";
import type { ScheduleIcon } from "../../config/eventConfig";

// Thin gold line icons (24×24, 1.25px stroke) drawn for this invitation.

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
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

export const IconCoupe = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 5h13c0 4.2-2.9 6.6-6.5 6.6S5.5 9.2 5.5 5Z" />
    <path d="M7.4 7.6c1.5.7 3 .8 4.6.4" opacity=".6" />
    <path d="M12 11.6V19M8.5 19.5h7" />
    <circle cx="16.6" cy="3.6" r="1.1" />
  </Svg>
);

export const IconRings = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9.3" cy="14.4" r="5" />
    <circle cx="14.7" cy="14.4" r="5" />
    <path d="M9.3 4.4 11 6.6 9.3 8.8 7.6 6.6Z" />
  </Svg>
);

export const IconCamera = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 8.2h3.6l1.6-2.4h6.6l1.6 2.4h3.6v10.5H3.5Z" />
    <circle cx="12" cy="13.3" r="3.4" />
    <path d="M17.4 10.6h.8" />
  </Svg>
);

export const IconDinner = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.2 16.6a7.8 7.8 0 0 1 15.6 0" />
    <path d="M3 16.8h18M5 19.4h14" />
    <circle cx="12" cy="7.2" r="1.1" />
    <path d="M12 8.3v.5" />
  </Svg>
);

export const IconMoon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.6 4.2a7.6 7.6 0 1 0 5.2 12.6 6.2 6.2 0 1 1-5.2-12.6Z" />
    <path d="M18.6 3.4v2.8M17.2 4.8H20" />
  </Svg>
);

export const IconChevronLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="m14.5 6-6 6 6 6" />
  </Svg>
);
export const IconChevronRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9.5 6 6 6-6 6" />
  </Svg>
);
export const IconChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </Svg>
);

export const IconMusic = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 17.5V6.2l10-2v11.3" />
    <circle cx="6.8" cy="17.6" r="2.2" />
    <circle cx="16.8" cy="15.6" r="2.2" />
  </Svg>
);

export const IconDownload = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" />
  </Svg>
);

export const IconCalendar = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="5.5" width="16" height="14" rx="1" />
    <path d="M4 9.5h16M8.5 3.5v4M15.5 3.5v4" />
  </Svg>
);

export const IconPin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s6.5-6.2 6.5-11.2a6.5 6.5 0 0 0-13 0C5.5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.8" r="2.3" />
  </Svg>
);

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5.5 12.5 4.2 4.2 8.8-9.4" />
  </Svg>
);

export const IconAlert = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.6v5.4M12 16.2v.2" />
  </Svg>
);

const SCHEDULE_ICONS: Record<ScheduleIcon, (p: IconProps) => ReactNode> = {
  coupe: IconCoupe,
  rings: IconRings,
  camera: IconCamera,
  dinner: IconDinner,
  moon: IconMoon,
};

export function ScheduleGlyph({ icon, ...rest }: IconProps & { icon: ScheduleIcon }) {
  const Glyph = SCHEDULE_ICONS[icon];
  return <Glyph {...rest} />;
}
