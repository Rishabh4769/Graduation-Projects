import { useState } from 'react';
import { Link } from 'react-router-dom';
import { destinations } from '../data/destinations';

function QuizPage() {
  const [form, setForm] = useState({ direction: '', budget: '', interest: '' });
  const [result, setResult] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const { direction, budget, interest } = form;
    const mappedDirection = direction.charAt(0).toUpperCase() + direction.slice(1);

    const interestMap = {
      nature: ['Nature', 'Beach', 'Hill', 'Wildlife'],
      adventure: ['Adventure'],
      spiritual: ['Spiritual'],
      heritage: ['Heritage', 'Cultural'],
    };

    const interestCategories = interestMap[interest] || [];

    const candidates = destinations.filter((item) => {
      const matchesDirection = item.direction === mappedDirection;
      const matchesInterest = item.categories.some((category) => interestCategories.includes(category));
      return matchesDirection && matchesInterest;
    });

    const recommendation = candidates[0] || destinations.find((item) => item.direction === mappedDirection) || destinations[0];

    const budgetHint =
      Number(budget) < 5000
        ? 'Look for shorter stays, public transport, and off-peak planning for better value.'
        : 'You have room for more premium stays or multi-stop routes.';

    setResult({
      title: recommendation.title,
      description: recommendation.description,
      link: '/destinations',
      budgetHint,
      highlight: recommendation.places[0]?.name,
    });
  };

  return (
    <main className="quiz-page">
      <div className="quiz-wrapper">
        <div className="emoji">🗺️</div>
        <h1>Find Your Perfect Destination</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="direction">Which part of India?</label>
          <select
            id="direction"
            value={form.direction}
            onChange={(event) => setForm((current) => ({ ...current, direction: event.target.value }))}
            required
          >
            <option value="">Choose direction</option>
            <option value="north">North</option>
            <option value="east">East</option>
            <option value="west">West</option>
            <option value="south">South</option>
          </select>

          <label htmlFor="budget">What&apos;s your budget (₹)?</label>
          <input
            id="budget"
            type="number"
            min="0"
            placeholder="Enter Budget"
            value={form.budget}
            onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))}
            required
          />

          <label htmlFor="interest">What interests you most?</label>
          <select
            id="interest"
            value={form.interest}
            onChange={(event) => setForm((current) => ({ ...current, interest: event.target.value }))}
            required
          >
            <option value="">Choose interest</option>
            <option value="nature">Nature &amp; Scenery</option>
            <option value="adventure">Adventure &amp; Sports</option>
            <option value="spiritual">Spiritual &amp; Pilgrimage</option>
            <option value="heritage">History &amp; Heritage</option>
          </select>

          <button type="submit">Show My Recommendation</button>
        </form>

        {result && (
          <div className="result">
            <strong>{result.title}</strong>
            <br />
            Start with {result.highlight}. {result.description}
            <br />
            {result.budgetHint}
            <br />
            <Link to={result.link}>Open destinations</Link>
          </div>
        )}

        <div className="home-btn">
          <Link to="/">Home</Link>
        </div>
      </div>
    </main>
  );
}

export default QuizPage;
