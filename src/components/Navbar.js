import React from "react";
import { motion } from "framer-motion";
import { useUI } from "../context/UIProvider";

const Navbar = ({ cartCount, onCartOpen, onSearchOpen }) => {
  const { theme, darkMode, toggleTheme, toggleDarkMode } = useUI();

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={{
        background:
          darkMode
            ? "rgba(5,10,20,0.75)"
            : "rgba(224,248,255,0.75)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--cyan-border)",
        zIndex: 1000,
      }}
    >
      <div className="container-fluid px-4">
        {/* Brand */}
        <a className="navbar-brand d-flex align-items-center gap-2" href="#" style={{ textDecoration: "none" }}>
          <div className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="var(--cyan-primary)" strokeWidth="1.5" />
              <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="var(--cyan-primary)" opacity="0.3" />
              <circle cx="14" cy="14" r="3" fill="var(--cyan-primary)" />
            </svg>
          </div>
          <span className="brand-name">ReshieGo</span>
        </a>

        <div className="d-flex align-items-center gap-3 ms-auto">
          {/* Search trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSearchOpen}
            className="btn btn-ghost-cyan d-flex align-items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span className="d-none d-md-inline" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
              Search
            </span>
            <kbd style={{
              background: "var(--cyan-muted)",
              border: "1px solid var(--cyan-border)",
              borderRadius: "4px",
              padding: "1px 5px",
              fontSize: "0.65rem",
              fontFamily: "var(--font-mono)",
              opacity: 0.7,
            }}>⌘K</kbd>
          </motion.button>

          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="btn btn-ghost-cyan"
            title={`Switch to ${theme === "cyber" ? "Minimal" : "Cyber"} theme`}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
              {theme === "cyber" ? "⬡ CYBER" : "○ MINIMAL"}
            </span>
          </motion.button>

          {/* Dark mode toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="btn btn-ghost-cyan"
            title="Toggle dark mode"
          >
            {darkMode ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </motion.button>

          {/* Cart */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCartOpen}
            className="btn btn-cyan-primary position-relative"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{ background: "var(--cyan-primary)", color: "#000", fontSize: "0.65rem", fontFamily: "var(--font-mono)" }}
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
