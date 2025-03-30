import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from './services/authService';
import './LandingPage.css';
import Footer from "./Footer";

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const result = await login({ email: formData.email, password: formData.password });
        localStorage.setItem('token', result.token);
        navigate('/hospitals');
      } else {
        await signup(formData);
        setMessage('Signup successful! Redirecting to login...');
        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.');
    }
  };

const handleFundraiserClick = (e) => {
    e.preventDefault(); 
    navigate("/Fundraiser"); 
  };

const handleGalleryClick = (e) => {
    e.preventDefault(); 
    navigate("/Gallery"); 
  };
  return (
    <>
      <nav className="navbar">
        <h2 className="logo">Canvas of Care</h2>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#Gallery" onClick={handleGalleryClick}>Gallery</a></li>
          <li><a href="#Fundraiser" onClick={handleFundraiserClick}>Fundraiser</a></li>
        </ul>
      </nav>

      <div className="landing-container">
        <div className="auth-box">
          <div className="auth-toggle">
            <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
            <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Sign Up</button>
          </div>
          <form onSubmit={handleSubmit}>
            {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
          </form>
        </div>
        <div className="welcome-section">
          <h1>Welcome to Canvas of Care!</h1>
          <p>A safe and fun place where young artists aged 5-15 can create, share, and explore amazing artwork!</p>
          <div className="gallery-preview">
            <img src="https://primary.jwwb.nl/unsplash/VkwRmha1_tI.jpg?enable-io=true&enable=upscale&crop=955%2C1146%2Cx483%2Cy0%2Csafe&width=800&height=960" alt="Artwork 1" />
            <img src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F923230543%2F2557388602261%2F1%2Foriginal.20241225-213508?h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&s=d338570b64d6c747553704914fa65dc4" alt="Artwork 2" />
          </div>
        </div>
      </div>
{/* Add Footer here */}
      <Footer />
    </>
  );
};

export default LandingPage;