import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <h3 style={styles.heading}>© Canvas of Care. All Rights Reserved.</h3>
      <p style={styles.links}>
        <Link to="/privacy-policy" style={styles.link}>Privacy Policy</Link> | 
        <Link to="/contact-us" style={styles.link}>Contact Us</Link> | 
        <Link to="/about-us" style={styles.link}>About Us</Link>
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: 'center',
    padding: '15px 0',
    background: '#d8a6ff',
    marginTop: '10px',
    fontSize: '18px',
    color: 'black',
    borderTop: '2px solid #c084f5'
  },
  heading: {
    margin: '5px 0',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  links: {
    margin: '5px 0',
    fontSize: '16px',
  },
  link: {
    color: '#6d28d9',
    textDecoration: 'none',
    margin: '0 8px',
    fontWeight: '500'
  }
};

export default Footer;
