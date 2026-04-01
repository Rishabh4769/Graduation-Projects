import TravelImage from '../components/TravelImage';
import { cuisines } from '../data/cuisines';

function CuisinesPage() {
  return (
    <main className="flex-grow-1">
      <section className="page-hero">
        <div className="page-hero__content">
          <p className="page-hero__eyebrow">Cuisine Atlas</p>
          <h1 className="page-hero__title">India through flavor and region</h1>
          <p className="page-hero__text">
            Discover a more tactile, region-based view of Indian food culture, from coastal spice to royal North Indian
            richness.
          </p>
        </div>
      </section>

      <div className="main-frame cuisines">
        <h2>Cuisines of India</h2>
        <p className="intro">
          Every region tells a different story through spice, texture, technique, and local ingredients.
        </p>
        <section className="cuisine-grid">
          {cuisines.map((cuisine) => (
            <article className="cuisine-card" key={cuisine.id}>
              <TravelImage src={cuisine.image} alt={cuisine.title} query={cuisine.title} />
              <h3>{cuisine.title}</h3>
              <p>{cuisine.description}</p>
              <ul className="cuisine-highlights">
                {cuisine.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

export default CuisinesPage;
