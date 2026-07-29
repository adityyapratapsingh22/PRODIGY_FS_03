export default function StarRating({ value = 0, size = 15 }) {
  const rounded = Math.round(value);
  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true">
          {n <= rounded ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}
