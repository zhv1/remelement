interface Props {
  leftRight?: string | null;
  frontBack?: string | null;
  className?: string;
  highlight?: boolean;
}

export default function PositionBadge({
  leftRight,
  frontBack,
  className = '',
  highlight = false,
}: Props) {
  const hasPosition =
    (leftRight && leftRight.trim()) || (frontBack && frontBack.trim());

  if (!hasPosition) return null;

  return (
    <div
      className={`absolute bottom-3 left-3 text-white text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded shadow-lg backdrop-blur-sm ${
        highlight ? 'bg-accent' : 'bg-brand-dark/90'
      } ${className}`}
    >
      {frontBack && frontBack.trim() && <span>{frontBack.trim()}</span>}
      {leftRight && leftRight.trim() && (
        <span className="ml-2">{leftRight.trim()}</span>
      )}
    </div>
  );
}