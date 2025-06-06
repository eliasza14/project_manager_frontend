import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PMOverview from './pages/pm_overview_page/PMOverview';
import Navbar from './components/Navbar';
import ProjectOverview from './pages/project_overview_page/ProjectOverview';
import UsersOverview from './pages/users_overview_page/UsersOverview';
import Dashboard from './pages/dashboard_page/Dashboard';
import UserRates from './pages/UserRates_page/UserRates';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/user-rates" element={<UserRates />} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/pmoverview" element={<PMOverview />} />
        <Route path="/usersoverview" element={<UsersOverview />} />
        <Route path="/projectoverview" element={<ProjectOverview />} />
        <Route path = "/" element = {<Dashboard/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
