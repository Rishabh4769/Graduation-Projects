import { useState } from 'react';
import TravelImage from '../components/TravelImage';
import jaipurImage from '../../static/images/jaipur.jpg';
import lehLadakhImage from '../../static/images/leh-ladakh.jpg';

const galleryItems = [
  { title: 'Leh-Ladakh', image: lehLadakhImage },
  { title: 'Jaipur City Palace', image: jaipurImage },
  {
    title: 'Taj Mahal',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Kerala Backwaters',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Hampi Ruins',
    image: 'https://images.unsplash.com/photo-1661257123362-5f3af6ef7aca?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Varanasi Ghats',
    image: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=1200&q=80',
  },
];

function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <main className="container my-4">
      <section className="page-hero">
        <div className="page-hero__content">
          <p className="page-hero__eyebrow">Visual Archive</p>
          <h1 className="page-hero__title">Photo Gallery</h1>
          <p className="page-hero__text">Experience India through landscapes, cities, architecture, and atmosphere.</p>
        </div>
      </section>

      <section className="gallery-grid-react">
        {galleryItems.map((item) => (
          <button
            key={item.title}
            className="gallery-photo-react"
            type="button"
            onClick={() => setSelectedImage(item)}
          >
            <TravelImage src={item.image} alt={item.title} query={item.title} />
            <span className="photo-caption-react">{item.title}</span>
          </button>
        ))}
      </section>

      <section className="gallery-copy">
        <h3>Discover India&apos;s Diversity through Our Lens</h3>
        <p>
          The gallery brings together architecture, landscapes, river cities, and everyday travel mood. It is designed as
          a visual entry point into the destinations section rather than a disconnected image dump.
        </p>
      </section>

      {selectedImage && (
        <div className="lightbox-backdrop" onClick={() => setSelectedImage(null)} role="presentation">
          <div className="lightbox-card" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <button className="lightbox-close" type="button" onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <TravelImage src={selectedImage.image} alt={selectedImage.title} query={selectedImage.title} />
            <p>{selectedImage.title}</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default GalleryPage;
