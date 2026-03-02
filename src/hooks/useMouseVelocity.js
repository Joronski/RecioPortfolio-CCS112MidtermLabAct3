import { useState, useEffect, useRef, useCallback } from "react";

// tracks mouse speed and direction, piped into background effects for a "momentum" feel.
export const useMouseVelocity = () => {
  const [velocity, setVelocity] = useState({ x: 0, y: 0, speed: 0 });
  const lastPos = useRef({ x: 0, y: 0, time: performance.now() });
  const rafRef = useRef(null);
  const pendingVelocity = useRef({ x: 0, y: 0, speed: 0 });

  const handleMouseMove = useCallback((e) => {
    const now = performance.now();
    const dt = now - lastPos.current.time || 1;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy) / dt;

    pendingVelocity.current = { x: dx / dt, y: dy / dt, speed };
    lastPos.current = { x: e.clientX, y: e.clientY, time: now };
  }, []);

  useEffect(() => {
    let animFrame;
    const tick = () => {
      setVelocity((prev) => {
        const next = pendingVelocity.current;
        // Smooth lerp so values don't jump
        return {
          x: prev.x * 0.85 + next.x * 0.15,
          y: prev.y * 0.85 + next.y * 0.15,
          speed: prev.speed * 0.85 + next.speed * 0.15,
        };
      });
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return velocity;
};