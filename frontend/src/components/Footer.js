import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-center text-lg-start mt-auto">
      <div className="text-center p-3">
        © 2023 Copyright:
        <a className="text-light" href="#">Your Website</a>
        <div className="social-media-links">
          <a href="https://facebook.com" className="text-light me-3"><i className="fab fa-facebook-f"></i></a>
          <a href="https://twitter.com" className="text-light me-3"><i className="fab fa-twitter"></i></a>
          <a href="https://instagram.com" className="text-light me-3"><i className="fab fa-instagram"></i></a>
          <a href="https://linkedin.com" className="text-light"><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

