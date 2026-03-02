import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useUI } from "../context/UIProvider";

/**
 * StatementCard — Prop-First modular product card
 * Props:
 *   glareIntensity: 0–1 (default 0.35)
 *   borderRadius: string (default "16px")
 *   hoverScale: number (default 1.04)
 *   product: Product object
 *   onAddToCart: fn
 */
const StatementCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  glareIntensity = 0.35,
  borderRadius = "16px",
  hoverScale = 1.04,
  isInCart = false,
  isInWishlist = false,
}) => {
  const { theme, darkMode } = useUI();
  const cardRef = useRef(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [added, setAdded] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlare({ x, y, opacity: glareIntensity });
  }, [glareIntensity]);

  const handleMouseLeave = useCallback(() => {
    setGlare((g) => ({ ...g, opacity: 0 }));
  }, []);

  const handleAdd = useCallback(() => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 700);
  }, [onAddToCart, product]);

  const handleWishlist = useCallback(() => {
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  }, [onAddToWishlist, product]);

  const isCyber = theme === "cyber";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: hoverScale, y: -6 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      style={{
        borderRadius,
        position: "relative",
        overflow: "hidden",
        background: darkMode
          ? isCyber
            ? "linear-gradient(135deg, rgba(0,20,35,0.95) 0%, rgba(0,35,55,0.9) 100%)"
            : "rgba(10,25,40,0.85)"
          : isCyber
          ? "linear-gradient(135deg, rgba(220,248,255,0.95) 0%, rgba(200,240,255,0.9) 100%)"
          : "rgba(240,252,255,0.95)",
        border: `1px solid ${isCyber ? "rgba(0,229,255,0.25)" : "rgba(0,188,212,0.15)"}`,
        boxShadow: darkMode
          ? isCyber
            ? "0 8px 32px rgba(0,229,255,0.08), inset 0 1px 0 rgba(0,229,255,0.1)"
            : "0 4px 20px rgba(0,0,0,0.3)"
          : "0 4px 20px rgba(0,188,212,0.1)",
        cursor: "pointer",
        height: "100%",
      }}
    >
      {/* Glare overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(0,229,255,${glare.opacity}) 0%, transparent 60%)`,
          opacity: glare.opacity,
          transition: "opacity 0.2s",
          pointerEvents: "none",
          zIndex: 1,
          borderRadius,
        }}
      />

      {/* Cyber corner decorations */}
      {isCyber && (
        <>
          <div className="card-corner card-corner-tl" />
          <div className="card-corner card-corner-br" />
        </>
      )}

      {/* Product Image */}
      <div style={{ position: "relative", overflow: "hidden", height: "180px" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            filter: isCyber && darkMode ? "saturate(0.8) hue-rotate(10deg)" : "none",
          }}
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/400x300/003344/00E5FF?text=${product.name}`;
          }}
        />
        {/* Image overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: darkMode
            ? "linear-gradient(to bottom, transparent 50%, rgba(5,10,20,0.8) 100%)"
            : "linear-gradient(to bottom, transparent 50%, rgba(224,248,255,0.5) 100%)",
        }} />

        {/* Badge */}
        {product.badge && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="badge-tag"
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: isCyber ? "var(--cyan-primary)" : "var(--cyan-secondary)",
              color: "#000",
              padding: "3px 10px",
              borderRadius: isCyber ? "2px" : "99px",
              fontSize: "0.65rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              zIndex: 2,
            }}
          >
            {product.badge}
          </motion.span>
        )}

        {/* Category tag */}
        <span style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "rgba(0,0,0,0.5)",
          color: "var(--cyan-primary)",
          padding: "2px 8px",
          borderRadius: "4px",
          fontSize: "0.6rem",
          fontFamily: "var(--font-mono)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(0,229,255,0.2)",
          zIndex: 2,
        }}>
          {product.category}
        </span>
      </div>

      {/* Card Body */}
      <div style={{ padding: "16px", position: "relative", zIndex: 2 }}>
        <h6 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "0.95rem",
          color: "var(--text-primary)",
          marginBottom: "4px",
          letterSpacing: isCyber ? "0.03em" : "0",
          lineHeight: 1.3,
        }}>
          {product.name}
        </h6>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
          marginBottom: "14px",
          lineHeight: 1.5,
          minHeight: "36px",
        }}>
          {product.description}
        </p>

        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--cyan-primary)",
              letterSpacing: "-0.02em",
            }}>
              ₱{product.price.toFixed(2)}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            className="btn-add-cart"
            style={{
              background: added
                ? "var(--cyan-primary)"
                : isCyber
                ? "rgba(0,229,255,0.1)"
                : "rgba(0,188,212,0.1)",
              border: `1px solid ${added ? "var(--cyan-primary)" : "var(--cyan-border)"}`,
              borderRadius: isCyber ? "4px" : "99px",
              color: added ? "#000" : "var(--cyan-primary)",
              padding: "7px 16px",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.05em",
            }}
>
            {added ? "✓ ADDED" : "+ CART"}
            </motion.button>
          </div>
      </div>
    </motion.div>
  );
};

export default StatementCard;
