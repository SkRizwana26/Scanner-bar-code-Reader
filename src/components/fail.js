import React from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';

function Fail() {
  const navigate = useNavigate();

  const handleNextScan = () => {
    navigate('/home');
  };

  return (
    <div className="fail-ok">
      <img src="/gif" alt="Success Tick" className="tick-animation" />

      <p>Invalid Ticket/Already scanned</p>
      <button onClick={handleNextScan}>Next Scan</button>
    </div>
  );
}

export default Fail;
