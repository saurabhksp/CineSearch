export default function MovieCard({
  movie,
  onViewDetails,
  onAddFav,
  onRemoveFav,
  isFavorite,
}) {
  return (
    <div className="movie-card">
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x450"
        }
        alt={movie.Title}
      />

      <div className="movie-info">
        <h3>{movie.Title}</h3>
        <p>📅 {movie.Year}</p>

        <div className="row">
          <button className="btn-secondary" onClick={() => onViewDetails(movie.imdbID)}>
            👁 Details
          </button>

          {!isFavorite ? (
            <button className="btn-warning" onClick={() => onAddFav(movie)}>
              ⭐ Fav
            </button>
          ) : (
            <button className="btn-danger" onClick={() => onRemoveFav(movie.imdbID)}>
              ❌ Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
