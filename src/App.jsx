import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import View from './pages/Viewpages/View';
import ViewReport from './pages/Viewpages/ViewReport';
import Layout from './layout/Layout';
import Login from './pages/Auth/Login';
import Privateroutes from './Privateroutes';

function App() {
  return (
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/*" element={<Privateroutes />} />

      {/* <Route path="/" element={<Layout><Homepage /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/view" element={<Layout noFooter><View /></Layout>} />
      <Route path="/view-report" element={<Layout noFooter><ViewReport /></Layout>} /> */}
    </Routes>
  );
}

export default App;
