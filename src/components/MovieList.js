import MovieCard from "./MovieCard";

export default function MovieList({
  movies,
  favorites,
  onViewDetails,
  onAddFav,
  onRemoveFav,
}) {
  return (
    <div className="grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onViewDetails={onViewDetails}
          onAddFav={onAddFav}
          onRemoveFav={onRemoveFav}
          isFavorite={favorites.some((f) => f.imdbID === movie.imdbID)}
        />
      ))}
    </div>
  );
}
