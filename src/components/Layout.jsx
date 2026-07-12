import { Link, Outlet } from "react-router-dom";
import logo from "../assets/footer.svg";
export default function Layout() {
  return (
    <div className="site">
      <nav className="nav">
        <Link to="/" className="brand">
          <span className="brandDollar">$</span> ghscanner
        </Link>
        <div className="navLinks">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </nav>

      <Outlet />

      <footer className="footer">
        <span>ghscanner - public GitHub metadata lookup</span>
        <div className="footerLinks">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
        <Link to="/" className="brand">
          <img
            src={logo}
            alt="ghscanner logo"
            style={{
              width: "150px",
              height: "150px",
              display: "block",
            }}
          />
        </Link>
      </footer>
    </div>
  );
}
