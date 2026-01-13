import { useEffect, useMemo, useState } from "react";
import "./index.css";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import MovieDetailsModal from "./components/MovieDetailsModal";
import Tabs from "./components/Tabs";

const API_KEY = "f4b5198"; // ✅ Your OMDb Key

export default function App() {
  const [activeTab, setActiveTab] = useState("search");

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // ✅ Filter + Sort
  const [type, setType] = useState("all"); // all | movie | series | episode
  const [sortBy, setSortBy] = useState("relevance"); // relevance | year_desc | year_asc | title_asc | title_desc

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favMovies")) || [];
  });

  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    localStorage.setItem("favMovies", JSON.stringify(favorites));
  }, [favorites]);

  const totalPages = useMemo(() => Math.ceil(totalResults / 10), [totalResults]);

  // ✅ Search Movies (fetch)
  const searchMovies = async (newPage = 1) => {
    if (!query.trim()) {
      setError("Please enter a movie name.");
      return;
    }

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      let url = `https://www.omdbapi.com/?s=${encodeURIComponent(
        query
      )}&apikey=${API_KEY}&page=${newPage}`;

      // ✅ Filter by type
      if (type !== "all") {
        url += `&type=${type}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === "False") {
        setError(data.Error);
        setMovies([]);
        setTotalResults(0);
      } else {
        setMovies(data.Search);
        setTotalResults(Number(data.totalResults || 0));
        setPage(newPage);
      }
    } catch (err) {
      setError("Something went wrong. Check internet or API key.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto fetch when Type changes (No Apply button needed)
  useEffect(() => {
    if (query.trim()) {
      searchMovies(1);
    }
    // eslint-disable-next-line
  }, [type]);

  // ✅ Sort locally (no API call needed)
  const sortedMovies = useMemo(() => {
    const copy = [...movies];

    if (sortBy === "year_desc") return copy.sort((a, b) => Number(b.Year) - Number(a.Year));
    if (sortBy === "year_asc") return copy.sort((a, b) => Number(a.Year) - Number(b.Year));
    if (sortBy === "title_asc") return copy.sort((a, b) => a.Title.localeCompare(b.Title));
    if (sortBy === "title_desc") return copy.sort((a, b) => b.Title.localeCompare(a.Title));

    return copy;
  }, [movies, sortBy]);

  // ✅ Movie Details Modal
  const openDetails = async (imdbID) => {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
      );
      const data = await res.json();
      setSelectedMovie(data);
    } catch (err) {
      alert("Failed to load details");
    }
  };

  // ✅ Favorites
  const addToFav = (movie) => {
    if (favorites.some((m) => m.imdbID === movie.imdbID)) return;
    setFavorites([...favorites, movie]);
  };

  const removeFav = (id) => {
    setFavorites(favorites.filter((m) => m.imdbID !== id));
  };

  return (
    <div className="container">
      <h1>🎬 CineSearch</h1>
      <p className="subtitle">Search • Filter • Sort • Favorites ⭐</p>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "search" && (
        <div className="card">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={() => searchMovies(1)}
          />

          {/* ✅ Filter + Sort (No Apply button) */}
          <div className="row" style={{ marginTop: 12 }}>
            <div>
              <label style={{ color: "#94a3b8", fontSize: 14 }}>Type</label>
              <br />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="movie">Movie</option>
                <option value="series">Series</option>
                <option value="episode">Episode</option>
              </select>
            </div>

            <div>
              <label style={{ color: "#94a3b8", fontSize: 14 }}>Sort</label>
              <br />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="year_desc">Year (Newest)</option>
                <option value="year_asc">Year (Oldest)</option>
                <option value="title_asc">Title (A-Z)</option>
                <option value="title_desc">Title (Z-A)</option>
              </select>
            </div>
          </div>

          {loading && <p>⏳ Loading...</p>}
          {error && <p style={{ color: "tomato" }}>❌ {error}</p>}

          {!loading && !error && totalResults > 0 && (
            <p style={{ color: "#94a3b8", marginTop: 12 }}>
              Showing page <b>{page}</b> of <b>{totalPages}</b> • Total results:{" "}
              <b>{totalResults}</b>
            </p>
          )}

          <MovieList
            movies={sortedMovies}
            favorites={favorites}
            onViewDetails={openDetails}
            onAddFav={addToFav}
            onRemoveFav={removeFav}
          />

          {!loading && totalPages > 1 && (
            <div className="row" style={{ marginTop: 20 }}>
              <button
                className="btn-secondary"
                disabled={page === 1}
                onClick={() => searchMovies(page - 1)}
                style={{ opacity: page === 1 ? 0.5 : 1 }}
              >
                ⬅ Prev
              </button>

              <button className="btn-secondary" disabled>
                Page {page}
              </button>

              <button
                className="btn-secondary"
                disabled={page === totalPages}
                onClick={() => searchMovies(page + 1)}
                style={{ opacity: page === totalPages ? 0.5 : 1 }}
              >
                Next ➡
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="card">
          <h2>⭐ Your Favorites</h2>

          {favorites.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No favorites saved yet.</p>
          ) : (
            <>
              <div className="row" style={{ marginBottom: 10 }}>
                <button className="btn-danger" onClick={() => setFavorites([])}>
                  🧹 Clear All Favorites
                </button>
              </div>

              <MovieList
                movies={favorites}
                favorites={favorites}
                onViewDetails={openDetails}
                onAddFav={addToFav}
                onRemoveFav={removeFav}
              />
            </>
          )}
        </div>
      )}

      <MovieDetailsModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}
