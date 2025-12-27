import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/clerk-react";

const Menubar = () => {
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const openLogin = () => {
    openSignIn({});
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{
      backgroundColor: '#0f0f14',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="container py-2">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <Logo />
          <span
            className="fw-bolder fs-4 mx-3"
            style={{
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            GenInvoico
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="nav navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <Link 
                className="nav-link fw-medium px-3" 
                to="/"
                style={{ color: '#a1a1aa' }}
                onMouseEnter={(e) => e.target.style.color = '#a78bfa'}
                onMouseLeave={(e) => e.target.style.color = '#a1a1aa'}
              >
                Home
              </Link>
            </li>
            <SignedIn>
              <li className="nav-item">
                <Link 
                  className="nav-link fw-medium px-3" 
                  to="/dashboard"
                  style={{ color: '#a1a1aa' }}
                  onMouseEnter={(e) => e.target.style.color = '#a78bfa'}
                  onMouseLeave={(e) => e.target.style.color = '#a1a1aa'}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-sm px-4 py-2 fw-semibold"
                  onClick={() => navigate("/generate")}
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px'
                  }}
                >
                  Create Invoice
                </button>
              </li>
              <li className="nav-item ms-2">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                    },
                  }}
                />
              </li>
            </SignedIn>
            <SignedOut>
              <li className="nav-item">
                <button
                  className="btn px-4 py-2 fw-semibold"
                  onClick={() => openLogin()}
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px'
                  }}
                >
                  Login / Sign Up
                </button>
              </li>
            </SignedOut>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
