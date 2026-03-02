import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "../hooks/useDebounce";
import { useUI } from "../context/UIProvider";

const SearchModal = ({ isOpen, onClose, products, onAddToCart }) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const inputRef = useRef(null);
  const { theme, darkMode } = useUI();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // CMD+K to open (handled in parent, but keep esc here)
  const filtered = debouncedQuery.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : products.slice(0, 5);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              zIndex: 2000,
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: -30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              position: "fixed",
              top: "12%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(600px, 92vw)",
              zIndex: 2001,
              background: darkMode
                ? "rgba(5,15,30,0.92)"
                : "rgba(224,248,255,0.92)",
              backdropFilter: "blur(24px)",
              border: "1px solid var(--cyan-border)",
              borderRadius: theme === "cyber" ? "8px" : "20px",
              boxShadow: "0 24px 80px rgba(0,229,255,0.15), 0 4px 20px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            {/* Search input */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 20px",
              borderBottom: "1px solid var(--cyan-border)",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="var(--cyan-primary)" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
              <kbd style={{
                background: "var(--card-bg)",
                border: "1px solid var(--cyan-border)",
                borderRadius: "4px",
                padding: "2px 7px",
                fontSize: "0.7rem",
                fontFamily: "var(--font-mono)",
                color: "var(--text-secondary)",
              }}>ESC</kbd>
            </div>

            {/* Results */}
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {debouncedQuery && (
                <div style={{
                  padding: "8px 20px 4px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--text-secondary)",
                  letterSpacing: "0.1em",
                }}>
                  {filtered.length} RESULT{filtered.length !== 1 ? "S" : ""}
                </div>
              )}

              <AnimatePresence mode="sync">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "12px 20px",
                      borderBottom: "1px solid rgba(0,229,255,0.06)",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,229,255,0.06)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "44px",
                        height: "44px",
                        objectFit: "cover",
                        borderRadius: theme === "cyber" ? "4px" : "8px",
                        border: "1px solid var(--cyan-border)",
                      }}
                      onError={(e) => { e.target.src = `https://via.placeholder.com/44x44/003344/00E5FF?text=${product.name[0]}`; }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                      }}>
                        {product.name}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--text-secondary)",
                      }}>
                        {product.category}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      color: "var(--cyan-primary)",
                      fontSize: "0.9rem",
                    }}>
                      ₱{product.price.toFixed(2)}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { onAddToCart(product); onClose(); }}
                      style={{
                        background: "rgba(0,229,255,0.12)",
                        border: "1px solid var(--cyan-border)",
                        borderRadius: "6px",
                        color: "var(--cyan-primary)",
                        padding: "5px 12px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      + ADD
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filtered.length === 0 && (
                <div style={{
                  padding: "32px 20px",
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                }}>
                  NO RESULTS FOR "{debouncedQuery}"
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div style={{
              padding: "10px 20px",
              borderTop: "1px solid var(--cyan-border)",
              display: "flex",
              gap: "16px",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
            }}>
              <span>↵ to add</span>
              <span>↑↓ navigate</span>
              <span>ESC close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
