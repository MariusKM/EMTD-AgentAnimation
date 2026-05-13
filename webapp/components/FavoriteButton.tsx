"use client";

export function FavoriteButton({
  favorite,
  onChange,
}: {
  favorite: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!favorite)}
      className={favorite ? "text-accent" : "text-border hover:text-muted"}
      title={favorite ? "Unfavorite" : "Favorite"}
    >
      {favorite ? "★" : "☆"}
    </button>
  );
}
