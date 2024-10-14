import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import EduBytesQuickFire from './EduBytesQuickFire';
import Profile from './Profile';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/edubytequickfire" element={<EduBytesQuickFire />} />
      <Route path="/Profile" element={<Profile />} />
    </Routes>
  </Router>
);