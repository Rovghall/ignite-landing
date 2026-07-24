import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function IconShell({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

/** Step 1 — Snap Track / Scan food (camera, same metaphor as app Quick Log) */
export function MealScanIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M4.5 8.25h2.1l1.15-1.9A1.5 1.5 0 0 1 9 5.75h6a1.5 1.5 0 0 1 1.25.6l1.15 1.9h2.1A1.75 1.75 0 0 1 21.25 10v7.5A1.75 1.75 0 0 1 19.5 19.25h-15A1.75 1.75 0 0 1 2.75 17.5V10A1.75 1.75 0 0 1 4.5 8.25z" />
      <circle cx="12" cy="13.25" r="3.35" />
    </IconShell>
  )
}

/** Step 2 — calories & macros (home calorie ring) */
export function MacrosRingIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <circle cx="12" cy="12" r="8.25" opacity="0.28" />
      <path d="M12 3.75a8.25 8.25 0 1 1-7.15 4.12" />
      <path
        d="M12 7.6c.45-.75.95-1.15 1.5-1.15.75 0 1.25.55 1.25 1.25 0 1.15-1.35 1.9-2.75 2.9-1.4-1-2.75-1.75-2.75-2.9 0-.7.5-1.25 1.25-1.25.55 0 1.05.4 1.5 1.15z"
        fill="currentColor"
        stroke="none"
      />
    </IconShell>
  )
}


/** Step 3 — log exercise / train (dumbbell, same as app Activity) */
export function StreakShareIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M6.25 9.25v5.5M17.75 9.25v5.5" />
      <path d="M4 10.5v3M20 10.5v3" />
      <path d="M6.25 12h11.5" />
      <rect x="2.75" y="9.75" width="2" height="4.5" rx="0.6" />
      <rect x="19.25" y="9.75" width="2" height="4.5" rx="0.6" />
      <rect x="5.25" y="8.5" width="2.25" height="7" rx="0.7" />
      <rect x="16.5" y="8.5" width="2.25" height="7" rx="0.7" />
    </IconShell>
  )
}
