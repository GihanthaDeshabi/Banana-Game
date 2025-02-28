// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Game from './pages/Game';
import BananaGame from './pages/BananaGame';

// Context
import { AuthProvider } from './context/AuthContext';

// CSS
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-banana-yellow to-banana-dark">
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/game" element={<Game />} />
            <Route path="/banana-game" element={<BananaGame />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;