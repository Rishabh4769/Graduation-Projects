import { Link, useParams } from 'react-router-dom';
import TravelImage from '../components/TravelImage';
import { placeMap } from '../data/places';
import useLocalStorage from '../hooks/useLocalStorage';

function PlaceDetailsPage() {
  const { placeId } = useParams();
  const place = placeMap[placeId];
  const [savedPlaces, setSavedPlaces] = useLocalStorage('savedPlaces', []);

  if (!place) {
    return (
      <main className="place-details">
        <div className="details-wrapper details-wrapper--fallback">
          <div className="text-content w-100 m-0">
            <h2>Place not found</h2>
            <p>That destination doesn&apos;t exist in the current React data set.</p>
            <Link to="/destinations" className="btn">
              Back to Destinations
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isSaved = savedPlaces.includes(place.id);

  const toggleSavedPlace = () => {
    setSavedPlaces((current) =>
      current.includes(place.id) ? current.filter((id) => id !== place.id) : [...current, place.id],
    );
  };

  return (
    <main>
      <div className="place-details">
        <div className="details-wrapper">
          <TravelImage src={place.image} alt={place.name} query={place.name} className="place-img" />
          <div className="text-content">
            <h2>{place.name}</h2>
            <span className="region">{place.region}</span>
            <p>{place.description}</p>
            <button type="button" className={`save-button save-button--detail${isSaved ? ' is-saved' : ''}`} onClick={toggleSavedPlace}>
              {isSaved ? 'Saved to your list' : 'Save this place'}
            </button>

            {place.specialDetails?.length > 0 && (
              <>
                <h3>Special Details</h3>
                <ul>
                  {place.specialDetails.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </>
            )}

            {place.festivalsCulture?.length > 0 && (
              <>
                <h3>Festivals &amp; Culture</h3>
                <ul>
                  {place.festivalsCulture.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </>
            )}

            <h3>Best Time to Visit</h3>
            <p>{place.bestTimeToVisit}</p>

            <Link to="/destinations" className="btn">
              Back to Destinations
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PlaceDetailsPage;
