/**
 * A survey benchmark: the triangle cut into a wall or post to mark a point of
 * known height. Open for a halt still ahead, filled solid for the destination.
 */
export function BenchmarkMark({
  size = 19,
  solid = false,
  className = "",
}: {
  size?: number;
  solid?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.9)}
      viewBox="0 0 20 18"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 2l8 14H2z"
        fill={solid ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.4}
      />
      {!solid && <circle cx="10" cy="12.4" r="1.6" fill="currentColor" />}
    </svg>
  );
}
