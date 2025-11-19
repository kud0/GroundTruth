// Premium SVG icons to replace emojis

interface IconProps {
  className?: string;
  size?: number;
}

export function BrainIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" opacity="0.3"/>
      <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="currentColor"/>
      <circle cx="10" cy="11" r="1.5" fill="currentColor"/>
      <circle cx="14" cy="11" r="1.5" fill="currentColor"/>
      <path d="M12 14c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z" fill="currentColor" opacity="0.7"/>
    </svg>
  );
}

export function BlockchainIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
      <rect x="15" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
      <rect x="3" y="15" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
      <rect x="15" y="15" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
      <line x1="9" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
      <line x1="6" y1="9" x2="6" y2="15" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
      <line x1="18" y1="9" x2="18" y2="15" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
      <line x1="9" y1="18" x2="15" y2="18" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
    </svg>
  );
}

export function DiamondIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 9L12 22L21 9L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" fill="currentColor" opacity="0.2"/>
      <path d="M3 9L12 22L21 9" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 2L7 9H17L12 2Z" fill="currentColor" opacity="0.4"/>
      <line x1="7" y1="9" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
      <line x1="17" y1="9" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  );
}

export function LightningIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14H11L11 22L21 10H13L13 2Z" fill="currentColor"/>
      <path d="M13 2L3 14H11L11 22L21 10H13L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  );
}

export function TargetIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
    </svg>
  );
}

export function RocketIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 7 4 7 10V16L5 18V20H19V18L17 16V10C17 4 12 2 12 2Z" fill="currentColor" opacity="0.3"/>
      <path d="M12 2C12 2 7 4 7 10V16L5 18V20H19V18L17 16V10C17 4 12 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="2" fill="currentColor"/>
      <path d="M9 20c0 1.5 1.5 2 3 2s3-0.5 3-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function ChartIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="10" y="8" width="4" height="13" rx="1" fill="currentColor" opacity="0.6"/>
      <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor"/>
      <path d="M3 12L7 8L10 11L14 7L17 3L21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  );
}

export function WalletIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2"/>
      <circle cx="17" cy="15" r="1.5" fill="currentColor"/>
      <path d="M7 6V4a2 2 0 012-2h6a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function LockIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="2" fill="currentColor"/>
      <path d="M12 18v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function DocumentIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" opacity="0.2"/>
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 13h8M8 17h8M8 9h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function RefreshIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 10c0-4.97-4.03-9-9-9-3.63 0-6.76 2.15-8.2 5.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 10h-5v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 14c0 4.97 4.03 9 9 9 3.63 0 6.76-2.15 8.2-5.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 14h5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3"/>
    </svg>
  );
}

export function CalendarIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.1"/>
      <path d="M3 9h18" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 5V3M16 5V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="7" y="12" width="2" height="2" rx="0.5" fill="currentColor"/>
      <rect x="11" y="12" width="2" height="2" rx="0.5" fill="currentColor"/>
      <rect x="15" y="12" width="2" height="2" rx="0.5" fill="currentColor"/>
      <rect x="7" y="16" width="2" height="2" rx="0.5" fill="currentColor"/>
      <rect x="11" y="16" width="2" height="2" rx="0.5" fill="currentColor"/>
    </svg>
  );
}

export function ClockIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.1"/>
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function InfoIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.1"/>
      <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="8" r="1" fill="currentColor"/>
    </svg>
  );
}

export function EyeIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.1"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function BriefcaseIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 12h18" stroke="currentColor" strokeWidth="2"/>
      <rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor" opacity="0.5"/>
    </svg>
  );
}

export function DollarIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.1"/>
      <path d="M12 6v12M9 9h6a2 2 0 010 4H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 15H9a2 2 0 000 4h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

export function ThinkingIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.1"/>
      <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
      <path d="M9 15c.5 1 1.5 2 3 2s2.5-1 3-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 8c2 0 3-1 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

export function TrendDownIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7l6 6 4-4 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 17v4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="13" r="2" fill="currentColor" opacity="0.3"/>
    </svg>
  );
}

export function ShieldIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" opacity="0.2"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CheckCircleIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
      <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function UsersIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
      <path d="M3 21c0-3.5 2.5-6 6-6s6 2.5 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M21 21c0-2.5-1.5-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

export function TrendUpIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 7v4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="11" r="2" fill="currentColor" opacity="0.3"/>
    </svg>
  );
}

export function BuildingIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.1"/>
      <path d="M9 21V15h6v6" stroke="currentColor" strokeWidth="2"/>
      <rect x="7" y="7" width="2" height="2" rx="0.5" fill="currentColor"/>
      <rect x="11" y="7" width="2" height="2" rx="0.5" fill="currentColor"/>
      <rect x="15" y="7" width="2" height="2" rx="0.5" fill="currentColor"/>
      <rect x="7" y="11" width="2" height="2" rx="0.5" fill="currentColor"/>
      <rect x="11" y="11" width="2" height="2" rx="0.5" fill="currentColor"/>
      <rect x="15" y="11" width="2" height="2" rx="0.5" fill="currentColor"/>
    </svg>
  );
}

export function QuestionIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.1"/>
      <path d="M9 9a3 3 0 015.3 2c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="18" r="1" fill="currentColor"/>
    </svg>
  );
}
