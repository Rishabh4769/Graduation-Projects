function AboutPage() {
  return (
    <main className="about-page">
      <section className="page-hero">
        <div className="page-hero__content">
          <p className="page-hero__eyebrow">About The Brand</p>
          <h1 className="page-hero__title">A calmer, richer way to explore India</h1>
          <p className="page-hero__text">
            Serene Indian Journeys is designed as a travel-first digital experience that balances destination discovery,
            atmosphere, and clarity.
          </p>
        </div>
      </section>

      <div className="main-frame about">
        <section className="about-intro">
          <h2>About Serene Indian Journeys</h2>
          <article>
            <p>
              Serene Indian Journeys is built to present India as a layered travel experience, not a checklist. The focus
              is on landscapes, local culture, food, wellness, and meaningful route discovery.
            </p>
          </article>
        </section>

        <section className="about-cards">
          <article className="card">
            <h3><span className="emoji">🌍</span> Our Mission</h3>
            <p>Help travelers find experiences that feel grounded in place, not generic package tourism.</p>
          </article>
          <article className="card">
            <h3><span className="emoji">🤝</span> Our Values</h3>
            <p>Respect local culture, travel sustainably, and make planning clear enough to act on.</p>
          </article>
          <article className="card">
            <h3><span className="emoji">🚀</span> Our Vision</h3>
            <p>Turn this project into a strong digital starting point for exploring India through a modern web experience.</p>
          </article>
        </section>

        <section className="about-grid">
          <article className="about-panel">
            <h2>Meet Our Team</h2>
            <p>
              The team combines travel curiosity, route planning, destination research, and a simple product goal: make
              the site feel inspiring without becoming confusing.
            </p>
            <p>
              The React version now supports a stronger design system, cleaner transitions, and a more consistent travel
              brand tone across every route.
            </p>
          </article>

          <article className="about-panel">
            <h2>What We Offer</h2>
            <ul className="about-list">
              <li>Region-led destination discovery.</li>
              <li>Quick travel inspiration through galleries and feature sections.</li>
              <li>Simple recommendation logic through an interactive quiz.</li>
              <li>Clean route-based browsing with React.</li>
              <li>A foundation that can later grow into bookings, itineraries, and APIs.</li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}

export default AboutPage;
