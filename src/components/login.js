import { useState } from 'react';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa'; 




export default function Login() {
  const [loginData, setLoginData] = useState({
    login_name: '',
    login_password: '',
  });

  const [showPassword, setShowPassword] = useState(false); // 👈 for toggling password

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


const navigate = useNavigate();

const [loading, setLoading] = useState(false); 

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!loginData.login_name || !loginData.login_password) {
    toast.error('All fields are required!');
    return;
  }

  setLoading(true); // ⬅️ Start loading

  try {
    const response = await fetch(
      'https://staging.eventking.io/api/eventscan/scannerLogin/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      }
    );

    const data = await response.json();

    if (data.stat === 0) {
      toast.success(data.succMsg || 'Login successful!');
      localStorage.setItem('login_token', data.login_token);

      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } else if (data.stat === 1 || data.stat === -1) {
      toast.error(data.errmsg || 'Login failed!');
    } else {
      toast.error('Unexpected server response.');
    }
  } catch (error) {
    toast.error('Something went wrong. Try again later.');
  } finally {
    setLoading(false); 
  }
};






  return (
    <div className="login-wrapper">
      <form className="login-container" onSubmit={handleSubmit}>
        <h3 className="login-title">Scanner Login</h3>

        <div className="form-group">
          <label htmlFor="login_name" className="form-label">User Name</label>
          <input
            value={loginData.login_name}
            type="text"
            name="login_name"
            id="login_name"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        


        <div className="form-group">
          <label htmlFor="login_password" className="form-label">Password</label>
          <div className="password-input-wrapper" style={{ position: 'relative' }}>
            <input
              value={loginData.login_password}
              type={showPassword ? 'text' : 'password'}
              name="login_password"
              id="login_password"
              className="form-control"
              onChange={handleChange}
              style={{ paddingRight: '40px' }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '26px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#888'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div><br />

        <div className="login-button">
  <button type="submit" className="btn" disabled={loading}>
    {loading ? (
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaSpinner className="spin" /> Logging in...
      </span>
    ) : (
      'Login'
    )}
  </button>
</div>

      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
