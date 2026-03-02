import React, { useState, useEffect, useCallback } from "react";
import { UIProvider, useUI } from "./context/UIProvider";
import ParticleBackground from "./components/ParticleBackground";
import Navbar from "./components/Navbar";
import StatementCard from "./components/StatementCard";
import CategoryBar from "./components/CategoryBar";
import Cart from "./components/Cart";
import SearchModal from "./components/SearchModal";
import { PRODUCTS, CATEGORIES } from "./data/products";
import "./App.css";

// Inner App (has access to UIContext) 
const AppInner = () => {
  const { theme, darkMode, activeCategory } = useUI();

// State 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  // useEffect: Simulate API fetch on mount 
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(PRODUCTS);
      setHeroVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // useEffect: Sync totalPrice whenever cart changes 
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cart]);

  // useEffect: CMD+K shortcut 
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Cart handlers 
  const handleAddToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleRemoveFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleUpdateQty = useCallback((id, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Wishlist handlers
  const handleAddToWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.filter((i) => i.id !== product.id);
      }
      return [...prev, { ...product }];
    });
  }, []);

  const handleRemoveFromWishlist = useCallback((id) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleMoveToCart = useCallback((item) => {
    handleAddToCart(item);
    handleRemoveFromWishlist(item.id);
  }, [handleAddToCart, handleRemoveFromWishlist]);

  // Filtered products 
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const wishlistCount = wishlist.length;

  // Render 
  return (
    <div
      className={`app-root ${theme} ${darkMode ? "dark" : "light"}`}
      style={{ minHeight: "100vh", position: "relative" }}
    >
      <ParticleBackground />

      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      <main style={{ paddingTop: "80px", position: "relative", zIndex: 1 }}>
        {/* ── Hero Banner ── */}
        <div
          className={`hero-banner ${heroVisible ? "visible" : ""}`}
          style={{ padding: "48px 24px 32px", textAlign: "center" }}
        >
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            color: "var(--cyan-primary)",
            marginBottom: "12px",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.6s ease 0.1s",
          }}>
            ⬡ RESHIEGO — SPORTS & ATTIRES
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.1,
              color: "var(--text-primary)",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s ease 0.2s",
              letterSpacing: "-0.02em",
            }}
          >
            PREMIUM SPORTS
            <br />
            <span style={{
              color: "var(--cyan-primary)",
              textShadow: theme === "cyber" ? "0 0 40px rgba(0,229,255,0.4)" : "none",
            }}>
              GEAR & ATTIRES
            </span>
          </h1>
          <p style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-secondary)",
            maxWidth: "480px",
            margin: "16px auto 0",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.6s ease 0.35s",
          }}>
            High-quality sports equipment and attires for every athlete. Gear up for your best performance yet.
          </p>

          {/* Stats row */}
          <div style={{
            display: "flex",
            gap: "32px",
            justifyContent: "center",
            marginTop: "28px",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.6s ease 0.45s",
          }}>
            {[
              { label: "PRODUCTS", value: products.length },
              { label: "CATEGORIES", value: CATEGORIES.length - 1 },
              { label: "IN CART", value: cartCount },
              { label: "WISHLIST", value: wishlistCount },
              { label: "TOTAL", value: `₱${totalPrice.toFixed(0)}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  color: "var(--cyan-primary)",
                }}>
                  {value}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  color: "var(--text-secondary)",
                  letterSpacing: "0.1em",
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Category Bar ── */}
        <div style={{
          padding: "0 24px 20px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}>
          <CategoryBar />
        </div>

        {/* ── Product Grid ── */}
        <div style={{
          padding: "0 24px 60px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}>
          {products.length === 0 ? (
            // Loading skeleton
            <div className="row g-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="skeleton-card" />
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                  style={{
                    opacity: 0,
                    animation: `fadeInUp 0.5s ease forwards`,
                    animationDelay: `${i * 0.07}s`,
                  }}
                >
                  <StatementCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    isInCart={cart.some((c) => c.id === product.id)}
                    isInWishlist={wishlist.some((w) => w.id === product.id)}
                    glareIntensity={theme === "cyber" ? 0.4 : 0.2}
                    borderRadius={theme === "cyber" ? "10px" : "18px"}
                    hoverScale={theme === "cyber" ? 1.05 : 1.03}
                  />
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && products.length > 0 && (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
            }}>
              NO PRODUCTS IN THIS CATEGORY
            </div>
          )}
        </div>
      </main>

      {/* ── Cart Sidebar ── */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onRemove={handleRemoveFromCart}
        onUpdateQty={handleUpdateQty}
        onClearCart={handleClearCart}
      />

      {/* ── Wishlist Sidebar ── */}
      <Cart
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        cartItems={wishlist}
        onRemove={handleRemoveFromWishlist}
        onUpdateQty={() => {}}
        onClearCart={() => setWishlist([])}
        isWishlist={true}
        onMoveToCart={handleMoveToCart}
      />

      {/* ── Search Modal ── */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

// Root App wrapped in UIProvider 
const App = () => (
  <UIProvider>
    <AppInner />
  </UIProvider>
);

export default App;
