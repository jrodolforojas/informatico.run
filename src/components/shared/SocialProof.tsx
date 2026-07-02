type SocialProofProps = {
  registered: number;
  capacity: number | null;
  className?: string;
};

export function SocialProof({ registered, capacity, className = "" }: SocialProofProps) {
  const remaining = capacity != null ? Math.max(capacity - registered, 0) : null;
  const pct = capacity ? Math.min(Math.round((registered / capacity) * 100), 100) : 0;

  return (
    <div className={`rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(15,27,45,0.06)] ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-mut">
            Corredores confirmados
          </div>
          <div className="mt-1.5 font-mono text-[28px] font-bold leading-none tracking-[-0.02em] text-teal-deep">
            {registered}
            {capacity != null && <span className="text-ink">/{capacity}</span>}
          </div>
        </div>
        {remaining != null && (
          <span className="font-mono text-[11px] tracking-[0.06em] text-mut">
            QUEDAN {remaining}
          </span>
        )}
      </div>

      {capacity != null && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-mint">
          <div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}
