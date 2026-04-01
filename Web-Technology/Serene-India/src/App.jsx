import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CuisinesPage from './pages/CuisinesPage';
import DestinationsPage from './pages/DestinationsPage';
import GalleryPage from './pages/GalleryPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import PlacesPage from './pages/PlacesPage';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/destinations/:placeId" element={<PlaceDetailsPage />} />
          <Route path="/cuisines" element={<CuisinesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
