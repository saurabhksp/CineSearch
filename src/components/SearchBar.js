export default function SearchBar({ query, setQuery, onSearch }) {
  return (
    <div className="row">
      <input
        type="text"
        placeholder="Search movie... (ex: Batman)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button className="btn-primary" onClick={onSearch}>
        🔍 Search
      </button>
    </div>
  );
}
