import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import ShowDetail from './pages/ShowDetail';
import Favorites from './pages/Favorites';
import Notfound from './pages/Notfound';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Assignment Requirement: Link to detailed view */}
        <Route path="/show/:id" element={<ShowDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;