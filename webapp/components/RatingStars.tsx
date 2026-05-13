"use client";

export function RatingStars({
  rating,
  onChange,
  size = "md",
}: {
  rating: number | null;
  onChange: (r: number | null) => void;
  size?: "sm" | "md";
}) {
  const px = size === "sm" ? "text-base" : "text-lg";
  return (
    <div className={`flex items-center gap-0.5 ${px}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (rating ?? 0) >= n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(rating === n ? null : n)}
            className={filled ? "text-accent" : "text-border hover:text-muted"}
            title={`${n} star${n === 1 ? "" : "s"}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
