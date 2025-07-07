import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './components/Landing';
import Feed from './pages/Feed';
import PostRant from './pages/PostRant';
import Profile from './pages/Profile';
import AppNavbar from './components/Navbar';
import EditRant from './pages/EditRant';

function AppWrapper() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <>
      {showNavbar && <AppNavbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/post" element={<PostRant />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit/:id" element={<EditRant />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
