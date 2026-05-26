export function DriveFlowLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 17h2l2-6 4 10 4-14 2 10h2" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        Drive<span className="text-neon">Flow</span>
      </span>
    </div>
  );
}
