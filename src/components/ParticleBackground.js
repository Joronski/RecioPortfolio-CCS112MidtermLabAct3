import React, { useRef, useEffect } from "react";
import { useMouseVelocity } from "../hooks/useMouseVelocity";
import { useUI } from "../context/UIProvider";

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const velocity = useMouseVelocity();
  const { theme, darkMode } = useUI();
  const stateRef = useRef({ velocity, theme, darkMode });

  useEffect(() => {
    stateRef.current = { velocity, theme, darkMode };
  }, [velocity, theme, darkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 80;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      const { velocity: vel, theme: t, darkMode: dm } = stateRef.current;
      const speed = Math.min(vel.speed * 60, 1);
      const cyanBase = t === "cyber" ? `0, 229, 255` : `0, 188, 212`;
      const bg = dm ? "rgba(5,10,20,0.18)" : "rgba(240,252,255,0.18)";

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // momentum push
        p.vx += vel.x * 0.001;
        p.vy += vel.y * 0.001;
        // damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        const baseSpeed = t === "cyber" ? 0.4 + speed * 1.2 : 0.2 + speed * 0.6;
        p.vx = Math.max(-baseSpeed, Math.min(baseSpeed, p.vx));
        p.vy = Math.max(-baseSpeed, Math.min(baseSpeed, p.vy));

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const glow = t === "cyber" ? 6 + speed * 8 : 2;
        ctx.shadowBlur = glow;
        ctx.shadowColor = `rgba(${cyanBase},0.8)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cyanBase},${p.opacity + speed * 0.3})`;
        ctx.fill();
      });

      // Draw connecting lines between close particles (cyber mode only)
      if (t === "cyber") {
        ctx.shadowBlur = 0;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${cyanBase},${(1 - dist / 100) * 0.15})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []); // stable — reads live state via stateRef

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default ParticleBackground;