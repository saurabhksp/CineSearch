export default function MovieDetailsModal({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <img
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/300x450"
          }
          alt={movie.Title}
        />

        <div>
          <h2>{movie.Title}</h2>
          <p><b>Year:</b> {movie.Year}</p>
          <p><b>Genre:</b> {movie.Genre}</p>
          <p><b>Actors:</b> {movie.Actors}</p>
          <p><b>IMDB Rating:</b> ⭐ {movie.imdbRating}</p>
          <p><b>Plot:</b> {movie.Plot}</p>

          <button className="btn-danger" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
