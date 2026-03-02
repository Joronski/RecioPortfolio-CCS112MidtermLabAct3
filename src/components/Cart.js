import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "../context/UIProvider";

const CartItem = ({ item, onRemove, onUpdateQty }) => {
  const { theme, darkMode } = useUI();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.85, transition: { duration: 0.25 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        display: "flex",
        gap: "12px",
        padding: "12px",
        borderRadius: theme === "cyber" ? "6px" : "12px",
        background: darkMode ? "rgba(0,229,255,0.04)" : "rgba(0,188,212,0.06)",
        border: "1px solid var(--cyan-border)",
        marginBottom: "10px",
        alignItems: "center",
      }}
    >
      <img
        src={item.image}
        alt={item.name}
        style={{
          width: "52px",
          height: "52px",
          objectFit: "cover",
          borderRadius: theme === "cyber" ? "4px" : "8px",
          border: "1px solid var(--cyan-border)",
          flexShrink: 0,
        }}
        onError={(e) => { e.target.src = `https://via.placeholder.com/52x52/003344/00E5FF?text=${item.name[0]}`; }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "0.82rem",
          color: "var(--text-primary)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {item.name}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
          {/* Qty controls */}
          <button
            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
            style={{
              width: "22px", height: "22px",
              background: "var(--card-bg)",
              border: "1px solid var(--cyan-border)",
              borderRadius: "4px",
              color: "var(--cyan-primary)",
              cursor: "pointer",
              fontSize: "0.9rem",
              lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >−</button>

          <motion.span
            key={item.quantity}
            initial={{ scale: 1.4, color: "var(--cyan-primary)" }}
            animate={{ scale: 1, color: "var(--text-primary)" }}
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "0.85rem",
              minWidth: "20px",
              textAlign: "center",
            }}
          >
            {item.quantity}
          </motion.span>

          <button
            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
            style={{
              width: "22px", height: "22px",
              background: "var(--card-bg)",
              border: "1px solid var(--cyan-border)",
              borderRadius: "4px",
              color: "var(--cyan-primary)",
              cursor: "pointer",
              fontSize: "0.9rem",
              lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >+</button>
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        {/* Animated price tag with pulse on qty change */}
        <motion.div
          key={`${item.id}-${item.quantity}`}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "var(--cyan-primary)",
            marginBottom: "4px",
          }}
        >
          ₱{(item.price * item.quantity).toFixed(2)}
        </motion.div>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--text-secondary)",
        }}>
          @₱{item.price.toFixed(2)}
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-secondary)",
          cursor: "pointer",
          padding: "4px",
          borderRadius: "4px",
          transition: "color 0.2s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#ff4d6d"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  );
};


const Cart = ({ isOpen, onClose, cartItems, onRemove, onUpdateQty, onClearCart }) => {
  const { theme, darkMode } = useUI();
  const [checkoutStatus, setCheckoutStatus] = useState("idle"); // idle, processing, success

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Show processing state
    setCheckoutStatus("processing");
    
    // Simulate checkout process
    setTimeout(() => {
      // Show success message
      setCheckoutStatus("success");
      
      // Clear cart after showing success
      setTimeout(() => {
        onClearCart();
        setCheckoutStatus("idle");
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 1500,
            }}
          />

          {/* Sidebar */}
          <motion.div
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(420px, 95vw)",
              background: darkMode
                ? "rgba(5,12,25,0.97)"
                : "rgba(224,248,255,0.97)",
              backdropFilter: "blur(20px)",
              borderLeft: "1px solid var(--cyan-border)",
              zIndex: 1501,
              display: "flex",
              flexDirection: "column",
              boxShadow: "-8px 0 60px rgba(0,229,255,0.08)",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--cyan-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <h5 style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  margin: 0,
                  letterSpacing: theme === "cyber" ? "0.05em" : 0,
                }}>
                  CART
                </h5>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--cyan-primary)",
                  marginTop: "2px",
                }}>
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {cartItems.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClearCart}
                    style={{
                      background: "rgba(255,77,109,0.1)",
                      border: "1px solid rgba(255,77,109,0.3)",
                      borderRadius: theme === "cyber" ? "4px" : "8px",
                      color: "#ff4d6d",
                      padding: "6px 12px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      cursor: "pointer",
                      letterSpacing: "0.05em",
                    }}
                  >
                    CLEAR ALL
                  </motion.button>
                )}
                <button
                  onClick={onClose}
                  style={{
                    background: "none",
                    border: "1px solid var(--cyan-border)",
                    borderRadius: "6px",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    padding: "6px 10px",
                    fontSize: "1rem",
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              <AnimatePresence mode="popLayout">
                {cartItems.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <div style={{ fontSize: "2.5rem", marginBottom: "12px", opacity: 0.4 }}>⬡</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                      CART IS EMPTY
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", marginTop: "8px", opacity: 0.6 }}>
                      Add items to get started
                    </div>
                  </motion.div>
                ) : (
                  cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={onRemove}
                      onUpdateQty={onUpdateQty}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer total */}
            {cartItems.length > 0 && (
              <motion.div
                layout
                style={{
                  padding: "20px 24px",
                  borderTop: "1px solid var(--cyan-border)",
                  background: darkMode ? "rgba(0,229,255,0.03)" : "rgba(0,188,212,0.05)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    SUBTOTAL ({totalItems})
                  </span>
                  <motion.span
                    key={totalPrice}
                    initial={{ scale: 1.1, color: "var(--cyan-primary)" }}
                    animate={{ scale: 1 }}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    ₱{totalPrice.toFixed(2)}
                  </motion.span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    SHIPPING
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--cyan-primary)" }}>FREE</span>
                </div>
                <div style={{
                  height: "1px",
                  background: "var(--cyan-border)",
                  margin: "12px 0",
                }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}>
                    TOTAL
                  </span>
                  <motion.span
                    key={`total-${totalPrice}`}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      fontSize: "1.3rem",
                      color: "var(--cyan-primary)",
                      textShadow: theme === "cyber" ? "0 0 20px rgba(0,229,255,0.5)" : "none",
                    }}
                  >
                    ₱{totalPrice.toFixed(2)}
                  </motion.span>
                </div>

                {/* Checkout Button with Status */}
                {checkoutStatus === "idle" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-checkout"
                    onClick={handleCheckout}
                    style={{
                      width: "100%",
                      padding: "13px",
                      background: "var(--cyan-primary)",
                      border: "none",
                      borderRadius: theme === "cyber" ? "4px" : "10px",
                      color: "#000",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    CHECKOUT →
                  </motion.button>
                )}

                {/* Processing State */}
                {checkoutStatus === "processing" && (
                  <motion.button
                    disabled
                    style={{
                      width: "100%",
                      padding: "13px",
                      background: "rgba(0,229,255,0.3)",
                      border: "none",
                      borderRadius: theme === "cyber" ? "4px" : "10px",
                      color: "var(--cyan-primary)",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      letterSpacing: "0.08em",
                      cursor: "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        border: "2px solid var(--cyan-primary)",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                      }}
                    />
                    PROCESSING...
                  </motion.button>
                )}

                {/* Success State */}
                {checkoutStatus === "success" && (
                  <motion.button
                    disabled
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      width: "100%",
                      padding: "13px",
                      background: "#00E676",
                      border: "none",
                      borderRadius: theme === "cyber" ? "4px" : "10px",
                      color: "#000",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      letterSpacing: "0.08em",
                      cursor: "default",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    ✓ ORDER PLACED!
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
