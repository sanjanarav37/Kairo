import React from 'react'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">

        <div className="footer-brand">
          <h2>KAIRO</h2>
          <p>
            Find something everyone wants to watch.
          </p>
        </div>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/room">Make a Room</a>
          <a href="/">Trending</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Kairo. Made with ❤️ for anime lovers.</p>
        <p>Anime data powered by Jikan API</p>
      </div>
    </footer>
  );
}

export default Footer;


