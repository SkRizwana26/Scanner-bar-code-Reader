import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { MdQrCodeScanner } from 'react-icons/md';
import '../App.css';

function Home() {
  const navigate = useNavigate();
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [showBigScanner, setShowBigScanner] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [showCameraToggleMenu, setShowCameraToggleMenu] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const bigScannerRef = useRef(null);
  const isBigScannerRunning = useRef(false);

  const handleLogout = () => navigate('/');
  const handleCancel = () => setShowConfirmationPopUp(false);

  useEffect(() => {
    const token = localStorage.getItem('login_token');
    if (!token) navigate('/login');
  }, []);

  useEffect(() => {
    if (!scannerVisible) return;

    const qrCodeScanner = new Html5Qrcode("qr-reader");

    qrCodeScanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 200, height: 200 } },
      (decodedText) => console.log("✅ SCANNED:", decodedText),
      (error) => console.log("⛔ Scan error:", error)
    )
    .then(() => console.log("✅ Small scanner started"))
    .catch((err) => console.error("❌ Small scanner start failed", err));

    return () => {
      qrCodeScanner.stop()
        .then(() => qrCodeScanner.clear())
        .then(() => console.log("🔴 Small scanner stopped"))
        .catch((e) => console.warn("⚠️ Stop error (small scanner):", e));
    };
  }, [scannerVisible]);

  useEffect(() => {
    if (!showBigScanner) return;

    const scanner = new Html5Qrcode("big-qr-reader");
    bigScannerRef.current = scanner;

    scanner.start(
      { facingMode },
      { fps: 10, qrbox: 250 },
 (decodedText) => {
  console.log("Scanned:", decodedText);

  try {
    const parsed = JSON.parse(decodedText);
    setScannedData(parsed);

    setTimeout(() => {
      navigate('/submit', { state: parsed });
    }, 3000);

  } catch {
    setScannedData({ raw: decodedText });

    setTimeout(() => {
      navigate('/submit', { state: { raw: decodedText } });
    }, 3000);
  }
},


      (error) => {}
    )
    .then(() => {
      isBigScannerRunning.current = true;
    })
    .catch((err) => console.error("Big scanner start failed", err));

    return () => {
      if (bigScannerRef.current && isBigScannerRunning.current) {
        bigScannerRef.current.stop()
          .then(() => bigScannerRef.current.clear())
          .then(() => {
            isBigScannerRunning.current = false;
            bigScannerRef.current = null;
          })
          .catch((err) => console.warn("Big scanner stop failed:", err));
      }
    };
  }, [showBigScanner, facingMode]);

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
        <button className="close-btn" onClick={() => setShowSidebar(false)}>✕</button>
        <button className="btn btn-danger mt-4" onClick={() => { setShowConfirmationPopUp(true); setShowSidebar(false); }}>
          Logout
        </button>
      </div>

      {/* Main Layout */}
      <div className="d-flex vh-100">
        <div className="w-50 bg-light d-flex justify-content-center align-items-center flex-column">
          <h2>Welcome</h2>
          {scannerVisible && (
            <div id="qr-reader" style={{ width: '300px', marginTop: '20px' }}></div>
          )}
        </div>
        <div className="w-50 bg-secondary text-white d-flex justify-content-center align-items-center">
          <h1>Scanner</h1>
        </div>
      </div>

      {/* Footer */}
      <div className="footer1">
        <button
          className="toggle-btn"
          onClick={() => setShowSidebar(true)}
          style={{ color: '#333', border: 'none', padding: '10px 15px', borderRadius: '5px', fontSize: '20px', cursor: 'pointer', borderTop: '2px solid #fff' }}
        >
          ☰
        </button>
        <div className='scannericon'>
          <button
            className="scanner-btn"
            onClick={() => {
              setShowBigScanner((prev) => {
                const newState = !prev;
                if (newState) setShowCameraToggleMenu(false);
                return newState;
              });
            }}
            style={{ background: 'white', color: '#333', border: 'none', padding: '11px', cursor: 'pointer' }}
          >
            <MdQrCodeScanner size={25} />
          </button>
        </div>
      </div>

      {/* Scanner Overlay */}
      {showBigScanner && (
        <div className="big-scanner-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', position: 'relative' }}>
            <div className="scanner-container" style={{ width: '300px', height: '300px', position: 'relative' }}>
              <div id="big-qr-reader" style={{
                width: '100%', height: '90%', background: '#000',
                borderRadius: '12px', border: '3px solid #00ffcc'
              }}></div>
              <div className="scanning-line"></div>
            </div>

           {scannedData && (
  <div style={{
    marginTop: '20px',
    background: '#111',
    borderRadius: '10px',
    padding: '10px',
    maxWidth: '350px',
    overflowX: 'auto'
  }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#00ffcc', fontSize: '13px' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #00ffcc' }}>
          <th style={{ padding: '8px', textAlign: 'left' }}>Key</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(scannedData).map(([key, value], index) => (
          <tr key={index} style={{ borderBottom: '1px solid #00ffcc' }}>
            <td style={{ padding: '8px' }}>{key}</td>
            <td style={{ padding: '8px' }}>
              {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowCameraToggleMenu((prev) => !prev)}
                style={{
                  background: '#333', color: '#fff', border: '1px solid #aaa',
                  padding: '8px', fontSize: '20px', borderRadius: '8px', cursor: 'pointer'
                }}
              >⚙️</button>

              {showCameraToggleMenu && (
                <div style={{
                  position: 'absolute', top: '110%', left: '50%',
                  transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: '8px',
                  background: '#222', border: '1px solid #00ffcc', borderRadius: '8px', padding: '10px',
                  width: '140px', zIndex: 10
                }}>
                  <button onClick={() => { setFacingMode('user'); setShowCameraToggleMenu(false); }} style={{
                    background: '#444', color: '#fff', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer'
                  }}>Front Camera</button>
                  <button onClick={() => { setFacingMode('environment'); setShowCameraToggleMenu(false); }} style={{
                    background: '#444', color: '#fff', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer'
                  }}>Back Camera</button>
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setShowBigScanner(false)} style={{
            position: 'absolute', top: '10px', right: '10px',
            background: 'transparent', color: '#fff', fontSize: '30px',
            border: 'none', cursor: 'pointer'
          }}>✕</button>
        </div>
      )}

      {/* Logout Confirmation */}
      {showConfirmationPopUp && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h5 className="mb-4">Are you sure you want to logout?</h5>
            <div className="d-flex justify-content-around">
              <button className="btns btn-danger px-4" onClick={handleLogout}>Yes</button>
              <button className="btns btn-secondary px-4" onClick={handleCancel}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
