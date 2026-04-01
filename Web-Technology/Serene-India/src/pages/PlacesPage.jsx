import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TravelImage from '../components/TravelImage';
import { places } from '../data/places';
import useLocalStorage from '../hooks/useLocalStorage';

function PlacesPage() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');
  const [savedPlaces, setSavedPlaces] = useLocalStorage('savedPlaces', []);

  const availableRegions = useMemo(
    () => [...new Set(places.map((place) => place.region))].sort(),
    [],
  );

  const filteredPlaces = useMemo(() => {
    const term = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesRegion = region === 'all' || place.region === region;
      const matchesSearch =
        !term ||
        place.name.toLowerCase().includes(term) ||
        place.description.toLowerCase().includes(term) ||
        place.specialDetails.some((detail) => detail.toLowerCase().includes(term));

      return matchesRegion && matchesSearch;
    });
  }, [region, search]);

  const toggleSavedPlace = (placeId) => {
    setSavedPlaces((current) =>
      current.includes(placeId) ? current.filter((id) => id !== placeId) : [...current, placeId],
    );
  };

  return (
    <main className="flex-grow-1">
      <section className="page-hero">
        <div className="page-hero__content">
          <p className="page-hero__eyebrow">Explorer</p>
          <h1 className="page-hero__title">Browse every featured place</h1>
          <p className="page-hero__text">
            Search across all available places, filter by region, and save the ones you want to come back to.
          </p>
        </div>
      </section>

      <section className="container pb-5">
        <div className="places-toolbar">
          <input
            type="text"
            className="destination-search"
            placeholder="Search places, landmarks, or experiences..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select className="form-select places-filter" value={region} onChange={(event) => setRegion(event.target.value)}>
            <option value="all">All Regions</option>
            {availableRegions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {savedPlaces.length > 0 && (
          <div className="saved-strip">
            <span className="saved-strip__label">Saved:</span>
            {savedPlaces.map((placeId) => {
              const place = places.find((item) => item.id === placeId);
              if (!place) {
                return null;
              }

              return (
                <Link key={place.id} to={`/destinations/${place.id}`} className="saved-pill">
                  {place.name}
                </Link>
              );
            })}
          </div>
        )}

        <div className="places-grid">
          {filteredPlaces.map((place) => {
            const isSaved = savedPlaces.includes(place.id);

            return (
              <article className="place-card" key={place.id}>
                <TravelImage src={place.image} alt={place.name} query={place.name} className="place-card__image" loading="lazy" />
                <div className="place-card__body">
                  <div className="place-card__top">
                    <span className="destination-pill">{place.region}</span>
                    <button
                      type="button"
                      className={`save-button${isSaved ? ' is-saved' : ''}`}
                      onClick={() => toggleSavedPlace(place.id)}
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                  <h3 className="card-title">{place.name}</h3>
                  <p className="card-description">{place.description}</p>
                  <p className="place-card__time">Best time: {place.bestTimeToVisit}</p>
                  <Link to={`/destinations/${place.id}`} className="btn btn--primary place-card__cta">
                    View Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="empty-state">
            <h3>No places match this search</h3>
            <p>Try a broader region or search for a city, park, lake, or type of experience.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default PlacesPage;
