import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Login from "./components/Login";

import Home from './pages/Home';
import PMOverview from './pages/pm_overview_page/PMOverview';
import Navbar from './components/Navbar';
import ProjectOverview from './pages/project_overview_page/ProjectOverview';
import UsersOverview from './pages/users_overview_page/UsersOverview';
import Dashboard from './pages/dashboard_page/Dashboard';
import UserRates from './pages/UserRates_page/UserRates';
import { PrimeReactProvider } from 'primereact/api';

function App() {


 const value = {
    ripple: true,
    
};

  return (
    <div>
      <PrimeReactProvider value={value}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>

            <Route path="/user-rates" element={<UserRates />} />
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/pmoverview" element={<PMOverview />} />
            <Route path="/usersoverview" element={<UsersOverview />} />
            <Route path="/projectoverview" element={<ProjectOverview />} />
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>
    </div>
  );
}

export default App;
