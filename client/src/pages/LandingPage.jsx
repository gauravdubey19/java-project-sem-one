import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/clerk-react";

import Logo from "../components/Logo";

const LandingPage = () => {
  const navigate = useNavigate();
  const { openSignIn } = useClerk();
  const [isVisible, setIsVisible] = useState({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Generate professional invoices in seconds, not hours.",
    },
    {
      icon: "🎨",
      title: "Beautiful Templates",
      description: "Choose from stunning designs that match your brand.",
    },
    {
      icon: "📊",
      title: "Smart Tracking",
      description: "Monitor payments and get insights at a glance.",
    },
    {
      icon: "☁️",
      title: "Cloud Sync",
      description: "Access your invoices anywhere, on any device.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Invoices Created" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "50+", label: "Templates Available" },
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`landing-nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <Logo />
          <span className="logo-text">GenInvoico</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <SignedIn>
            <a href="#" onClick={() => navigate("/dashboard")}>
              Dashboard
            </a>
            <button className="nav-cta" onClick={() => navigate("/generate")}>
              Create Invoice
            </button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <button className="nav-cta" onClick={() => openSignIn({})}>
              Login / Sign Up
            </button>
          </SignedOut>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="hero-content">
          <span className="hero-badge">✨ Invoicing Made Simple</span>
          <h1 className="hero-title">
            Professional Invoices
            <br />
            <span className="gradient-text">In Minutes</span>
          </h1>
          <p className="hero-description">
            Stop wasting time on manual invoicing. Create, send, and track beautiful invoices that get you paid faster.
          </p>
          <div className="hero-actions">
            <SignedIn>
              <button className="btn-primary" onClick={() => navigate("/generate")}>
                Create New Invoice
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
                View Dashboard
              </button>
            </SignedIn>
            <SignedOut>
              <button className="btn-primary" onClick={() => openSignIn({})}>
                Get Started Free
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn-secondary" onClick={() => openSignIn({})}>
                <span className="play-icon">▶</span>
                Watch Demo
              </button>
            </SignedOut>
          </div>
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section animate-on-scroll">
        <div className={`section-content ${isVisible["features"] ? "visible" : ""}`}>
          <span className="section-badge">Features</span>
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">Powerful tools to streamline your invoicing workflow</p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section animate-on-scroll">
        <div className={`section-content ${isVisible["how-it-works"] ? "visible" : ""}`}>
          <span className="section-badge">How It Works</span>
          <h2 className="section-title">Three Simple Steps</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Choose Template</h3>
              <p>Pick from our collection of professional designs</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Add Details</h3>
              <p>Fill in your business and client information</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Send & Track</h3>
              <p>Download or share and monitor payment status</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of businesses creating professional invoices</p>
          <SignedIn>
            <button className="btn-primary btn-large" onClick={() => navigate("/generate")}>
              Create Your First Invoice
              <span className="btn-arrow">→</span>
            </button>
          </SignedIn>
          <SignedOut>
            <button className="btn-primary btn-large" onClick={() => openSignIn({})}>
              Sign Up Free
              <span className="btn-arrow">→</span>
            </button>
          </SignedOut>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Logo />
            <span className="logo-text">GenInvoico</span>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <SignedIn>
              <a href="#" onClick={() => navigate("/dashboard")}>
                Dashboard
              </a>
            </SignedIn>
          </div>
          <p className="footer-copyright">© {new Date().getFullYear()} GenInvoico. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
