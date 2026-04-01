import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <main className="flex-grow-1">
      <section className="hero home-hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <p className="hero-kicker">Curated routes across India</p>
          <h2 className="hero-title">Begin Your Journey to Wonder</h2>
          <p className="hero-subtitle">
            Explore breathtaking landscapes, layered culture, and destination stories that feel cinematic instead of generic.
            <br />
            <Link to="/quiz" className="quiz-link">
              Find Your Destination
            </Link>
          </p>
          <div className="cta-buttons">
            <Link to="/destinations" className="btn btn--primary">
              View Top Destinations
            </Link>
            <Link to="/about" className="btn btn--outline">
              Explore Our Story
            </Link>
          </div>
          <div className="hero-stats">
            
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <svg width="28" height="28" viewBox="0 0 24 24" stroke="#217a91" fill="none">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </section>

      <section className="section highlights">
        <div className="container">
          <div className="section-intro">
            <p className="section-eyebrow">Why This Feels Different</p>
            <h2 className="section-title">An India travel concept with editorial polish</h2>
          </div>
          <div className="highlights-grid">
            <div className="highlight-card">
              <img
                src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80"
                alt="Indian mountain landscape"
              />
              <h3>Natural Magic</h3>
              <p>From mountain passes to tropical backwaters, India delivers dramatic contrasts at every turn.</p>
            </div>
            <div className="highlight-card">
              <img
                src="https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?auto=format&fit=crop&w=900&q=80"
                alt="Indian culture"
              />
              <h3>Culture &amp; Heritage</h3>
              <p>Step into palace cities, temple towns, festivals, crafts, and centuries of living tradition.</p>
            </div>
            <div className="highlight-card">
              <img
                src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80"
                alt="Indian food"
              />
              <h3>Cuisine Adventure</h3>
              <p>Travel through India by taste, from royal thalis and street snacks to regional comfort food.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section experiences">
        <div className="container">
          <div className="section-intro">
            <p className="section-eyebrow section-eyebrow--light">Moments That Define The Trip</p>
          </div>
          <h2 className="section-title">Celebrate Indian Festivals</h2>
          <p>Discover the spirit of India through celebrations built on light, color, devotion, dance, and community.</p>
          <ul>
            <li><strong>Diwali:</strong> homes, temples, and streets lit with lamps and celebration.</li>
            <li><strong>Holi:</strong> a festival of color, joy, and playful energy.</li>
            <li><strong>Navratri:</strong> nights of dance, devotion, and regional tradition.</li>
            <li><strong>Durga Puja:</strong> public art, ritual processions, and cultural immersion.</li>
          </ul>
        </div>
      </section>

      <section className="section highlights" style={{ background: '#f0f6f7' }}>
        <div className="container">
          <div className="section-intro">
            <p className="section-eyebrow">Slow Travel</p>
          </div>
          <h2 className="section-title">Wellness &amp; Spiritual Retreats</h2>
          <p>Reconnect through yoga, Ayurveda, meditation, and slow travel in restorative settings.</p>
          <div className="highlights-grid">
            <div className="highlight-card">
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80"
                alt="Yoga retreat"
              />
              <h3>Yoga Retreats</h3>
              <p>Practice in quiet natural settings that support stillness, focus, and recovery.</p>
            </div>
            <div className="highlight-card">
              <img
                src="https://images.unsplash.com/photo-1668916938366-dd16c56719e8?auto=format&fit=crop&w=900&q=80"
                alt="Ayurvedic healing"
              />
              <h3>Ayurvedic Healing</h3>
              <p>Traditional therapies, herbal care, and holistic approaches rooted in centuries of practice.</p>
            </div>
            <div className="highlight-card">
              <img
                src="https://images.unsplash.com/photo-1562088287-bde35a1ea917?auto=format&fit=crop&w=900&q=80"
                alt="Meditation"
              />
              <h3>Meditation Centers</h3>
              <p>Step away from noise and build a calmer rhythm through guided reflection and mindful travel.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section experiences">
        <div className="container">
          <div className="section-intro">
            <p className="section-eyebrow section-eyebrow--light">Travel Better</p>
          </div>
          <h2 className="section-title">Travel Tips &amp; Essentials</h2>
          <ul>
            <li>Choose your season carefully. India changes radically by region and month.</li>
            <li>Pack for local culture and climate, not just for itinerary photos.</li>
            <li>Keep room for slow moments. The strongest memories are rarely the rushed ones.</li>
            <li>Use local transport strategically and book high-demand routes early.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
