import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="empty-state">
        <h2>Page not found</h2>
        <p>The route you requested does not exist in the React app.</p>
        <Link to="/" className="btn btn--primary">
          Back Home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
