import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useUI } from "../context/UIProvider";
import { CATEGORIES } from "../data/products";

const CategoryBar = ({ onCategoryHover }) => {
  const { activeCategory, setActiveCategory, theme } = useUI();

  return (
    <div className="d-flex gap-2 flex-wrap align-items-center">
      {CATEGORIES.map((cat) => (
        <motion.button
          key={cat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => onCategoryHover?.(cat)}
          onClick={() => setActiveCategory(cat)}
          style={{
            padding: "5px 14px",
            borderRadius: theme === "cyber" ? "3px" : "99px",
            border: `1px solid ${activeCategory === cat ? "var(--cyan-primary)" : "var(--cyan-border)"}`,
            background: activeCategory === cat
              ? "var(--cyan-primary)"
              : "var(--card-bg)",
            color: activeCategory === cat ? "#000" : "var(--cyan-primary)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            letterSpacing: "0.05em",
          }}
        >
          {cat.toUpperCase()}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryBar;