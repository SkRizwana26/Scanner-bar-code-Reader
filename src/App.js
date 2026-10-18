import { useState } from 'react';
import './App.css';
import Login from './components/login';
import QrScannerTest from './components/home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Home from './components/home';
import Submit from './components/submit';
import Success from './components/successful';
import Fail from './components/fail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/qr-test" element={<QrScannerTest />} /> 
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/success" element={<Success />}/>
        <Route path="/fail" element={<Fail />}/>
      </Routes>
    </Router>
  ); 
}

export default App;
