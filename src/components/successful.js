import React from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';

function Success() {
  const navigate = useNavigate();

  const handleNextScan = () => {
    navigate('/home');
  };

  return (
    <div className="success-ok">
      <img src="/gif" alt="Success Tick" className="tick-animation" />

      <p>Ticket Scanned Successfully</p>
      <button onClick={handleNextScan}>Next Scan</button>
    </div>
  );
}

export default Success;
