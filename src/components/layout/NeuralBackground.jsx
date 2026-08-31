import React, { useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';

export const NeuralBackground = () => {
  const { theme } = useCart();
  const isDark = theme === 'dark';
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    let animationFrameId;
    let isPaused = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // High Density Optimized Particle System
    const particleCount = Math.min(120, Math.max(70, Math.floor(window.innerWidth / 14)));

    const darkColors = [
      'rgba(249, 115, 22, ',   // Neon Orange
      'rgba(245, 158, 11, ',   // Amber Gold
      'rgba(56, 189, 248, ',   // Neon Cyan
      'rgba(239, 68, 68, ',    // Flame Red
      'rgba(168, 85, 247, '    // Cyber Violet
    ];

    const lightColors = [
      'rgba(234, 88, 12, ',    // Deep Orange
      'rgba(217, 119, 6, ',    // Warm Amber
      'rgba(2, 132, 199, ',    // Electric Azure
      'rgba(220, 38, 38, ',    // Crimson
      'rgba(124, 58, 237, '    // Purple
    ];

    const colors = isDark ? darkColors : lightColors;

    const particles = Array.from({ length: particleCount }, () => {
      const colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        baseRadius: Math.random() * 2 + 1.2,
        radius: Math.random() * 2 + 1.2,
        pulseAngle: Math.random() * Math.PI * 2,
        pulseSpeed: 0.03 + Math.random() * 0.03,
        color: colorPrefix
      };
    });

    const render = () => {
      if (isPaused) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const hasMouse = mx > 0 && my > 0;

      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];

        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) { p1.x = 0; p1.vx *= -1; }
        else if (p1.x > w) { p1.x = w; p1.vx *= -1; }

        if (p1.y < 0) { p1.y = 0; p1.vy *= -1; }
        else if (p1.y > h) { p1.y = h; p1.vy *= -1; }

        // Dynamic pulse
        p1.pulseAngle += p1.pulseSpeed;
        p1.radius = p1.baseRadius + Math.sin(p1.pulseAngle) * 0.5;

        // Mouse attraction
        if (hasMouse) {
          const dxMouse = mx - p1.x;
          const dyMouse = my - p1.y;
          const distSq = dxMouse * dxMouse + dyMouse * dyMouse;
          if (distSq < 32400) { // 180px
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 180) * 0.65;
            p1.x += (dxMouse / dist) * force;
            p1.y += (dyMouse / dist) * force;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, Math.max(0.8, p1.radius), 0, Math.PI * 2);
        ctx.fillStyle = p1.color + (isDark ? '0.85)' : '0.75)');
        ctx.fill();

        // Optimized connection lines (limit max connections per node to 3 for ultra-low CPU footprint)
        let connections = 0;
        for (let j = i + 1; j < particleCount && connections < 3; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 18225) { // 135px
            connections++;
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / 135) * (isDark ? 0.26 : 0.18);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(249, 115, 22, ${alpha})`
              : `rgba(234, 88, 12, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Connect near particles to active mouse cursor
      if (hasMouse) {
        let mouseConnections = 0;
        for (let i = 0; i < particleCount && mouseConnections < 8; i++) {
          const p = particles[i];
          const dx = mx - p.x;
          const dy = my - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 25600) { // 160px
            mouseConnections++;
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / 160) * (isDark ? 0.42 : 0.32);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -1000, y: -1000 };
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
      } else {
        isPaused = false;
        render();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, isDark]);

  return (
    <div className="home-neural-bg-root" style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
      transform: 'translateZ(0)',
      willChange: 'transform'
    }}>
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Cyber Grid Texture Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: isDark
          ? `linear-gradient(to right, rgba(249, 115, 22, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(249, 115, 22, 0.045) 1px, transparent 1px)`
          : `linear-gradient(to right, rgba(234, 88, 12, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(234, 88, 12, 0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        opacity: isDark ? 0.75 : 0.6,
        pointerEvents: 'none'
      }} />

      {/* Optimized Ambient Glow Energy Orbs */}
      <div style={{
        position: 'absolute',
        top: '6%',
        left: '12%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(249, 115, 22, 0.16) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(249, 115, 22, 0.10) 0%, transparent 70%)',
        filter: 'blur(65px)',
        pointerEvents: 'none',
        animation: 'pulseGlowOrange 6s infinite ease-in-out'
      }} />

      <div style={{
        position: 'absolute',
        top: '50%',
        right: '8%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(2, 132, 199, 0.08) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default NeuralBackground;
