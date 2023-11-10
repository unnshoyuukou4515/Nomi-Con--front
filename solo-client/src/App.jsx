import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './components/Login/Login'; 
import RegistrationForm from './components/Register/Register'; 
import Home from './components/Home/Home'; 
import ViewMap from './components/Map/ViewMap'; 
import History from './components/History/History'
import SearchStation from './components/SearchStation/SearchStation'

function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path="/Register" element={<RegistrationForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Map" element={<ViewMap />} />
        <Route path="/History" element={<History />} />
        <Route path="/SearchStation" element={<SearchStation />} />
      </Routes>
    </Router>
  );
}

export default App;
