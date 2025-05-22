import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PMOverview from './pages/pm_overview_page/PMOverview';
import Navbar from './components/Navbar';
import UsersOverview from './pages/users_overview_page/UsersOverview';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pmoverview" element={<PMOverview />} />
        <Route path="/usersoverview" element={<UsersOverview />} />
      </Routes>
    </Router>
  );
}

export default App;
