// Submit.js
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

function Submit() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketData = location.state || {};

  useEffect(() => {
    const ticketNo = ticketData.ticket_no || ticketData.name || "";
    console.log("Ticket data:", ticketData);
    console.log("Ticket number:", ticketNo);

    if (!ticketNo) {
      navigate("/fail");
      return;
    }

    const scannedTickets = JSON.parse(localStorage.getItem("scannedTickets") || "[]");

    if (scannedTickets.includes(ticketNo)) {
      navigate("/fail");
    } else {
      scannedTickets.push(ticketNo);
      localStorage.setItem("scannedTickets", JSON.stringify(scannedTickets));
      navigate("/success");
    }
  }, [ticketData, navigate]);

  return null; // No UI needed; it's only for logic and redirect
}

export default Submit;