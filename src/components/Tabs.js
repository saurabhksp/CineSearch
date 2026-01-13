export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="row" style={{ marginBottom: 15 }}>
      <button
        className={`tab-btn ${
          activeTab === "search" ? "active-tab" : "btn-secondary"
        }`}
        onClick={() => setActiveTab("search")}
      >
        🔍 Search
      </button>

      <button
        className={`tab-btn ${
          activeTab === "favorites" ? "active-tab" : "btn-secondary"
        }`}
        onClick={() => setActiveTab("favorites")}
      >
        ⭐ Favorites
      </button>
    </div>
  );
}
