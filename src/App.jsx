import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Ticket from './pages/Ticket';
import Food from './pages/Food';
import Map from './pages/Map';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="dark">
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/food" element={<Food />} />
          <Route path="/map" element={<Map />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
