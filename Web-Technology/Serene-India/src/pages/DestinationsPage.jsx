import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TravelImage from '../components/TravelImage';
import { destinations } from '../data/destinations';

function DestinationsPage() {
  const [search, setSearch] = useState('');
  const [direction, setDirection] = useState('all');
  const [category, setCategory] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState(null);

  const availableDirections = useMemo(
    () => [...new Set(destinations.map((item) => item.direction))],
    [],
  );

  const availableCategories = useMemo(
    () => [...new Set(destinations.flatMap((item) => item.categories))],
    [],
  );

  const filteredDestinations = useMemo(() => {
    const term = search.trim().toLowerCase();

    return destinations.filter((item) => {
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.places.some((place) => place.name.toLowerCase().includes(term));

      const matchesDirection = direction === 'all' || item.direction === direction;
      const matchesCategory = category === 'all' || item.categories.includes(category);

      return matchesSearch && matchesDirection && matchesCategory;
    });
  }, [search, direction, category]);

  return (
    <main className="flex-grow-1">
      <section className="page-hero">
        <div className="page-hero__content">
          <p className="page-hero__eyebrow">Destination Index</p>
          <h1 className="page-hero__title">Top Destinations of India</h1>
          <p className="page-hero__text">Explore mountain escapes, heritage cities, river towns, and cultural landscapes.</p>
        </div>
      </section>

      <section className="container pb-5">
        <div className="search-container text-center">
          <input
            type="text"
            placeholder="Search destinations..."
            aria-label="Search destinations"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="destination-search"
          />
        </div>

        <div className="filters row justify-content-center g-3 mb-4">
          <div className="col-auto">
            <select className="form-select" value={direction} onChange={(event) => setDirection(event.target.value)}>
              <option value="all">All Directions</option>
              {availableDirections.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="col-auto">
            <select className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All Categories</option>
              {availableCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="col-auto">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setSearch('');
                setDirection('all');
                setCategory('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="destinations-grid-react">
          {filteredDestinations.map((item) => (
            <article className="destination-card-react" key={item.id}>
              <div className="card-image-wrapper">
                <TravelImage src={item.image} alt={item.title} query={item.title} className="card-image" loading="lazy" />
                <div className="card-overlay"></div>
              </div>
              <div className="card-content">
                <div className="destination-meta">
                  <span className="destination-pill">{item.direction}</span>
                  <span className="destination-pill">{item.categories.join(' / ')}</span>
                </div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
                <button
                  className="places-toggle"
                  type="button"
                  onClick={() => setSelectedDestination(item)}
                >
                  <span className="toggle-icon">+</span>
                  <span className="toggle-text">Browse Places</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="empty-state">
            <h3>No destinations match this search</h3>
            <p>Try a broader region, remove a category filter, or search by a place name.</p>
          </div>
        )}

        {selectedDestination && (
          <div
            className="destination-modal-backdrop"
            onClick={() => setSelectedDestination(null)}
            role="presentation"
          >
            <div
              className="destination-modal"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="destination-modal-title"
            >
              <button
                className="destination-modal__close"
                type="button"
                onClick={() => setSelectedDestination(null)}
                aria-label="Close places popup"
              >
                ×
              </button>

              <div className="destination-modal__header">
                <span className="destination-pill">{selectedDestination.direction}</span>
                <h3 id="destination-modal-title">{selectedDestination.title}</h3>
                <p>{selectedDestination.description}</p>
              </div>

              <div className="destination-modal__list">
                {selectedDestination.places.map((place) => (
                  <article className="destination-modal__item" key={place.id}>
                    <div>
                      <h4>{place.name}</h4>
                      <p>{place.description}</p>
                    </div>
                    <Link to={`/destinations/${place.id}`} className="btn btn--primary">
                      View Place
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default DestinationsPage;
