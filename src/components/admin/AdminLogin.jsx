import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';

export const AdminLogin = () => {
  const { login, navigateToStorefront, theme, toggleTheme } = useCart();
  
  // State
  const [email, setEmail] = useState('admin@creotex.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [pingMs, setPingMs] = useState(14);

  const canvasRef = useRef(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  // Live Clock & Dynamic Ping
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0] + ' IST');
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);

    const pingTimer = setInterval(() => {
      setPingMs(Math.floor(12 + Math.random() * 6));
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(pingTimer);
    };
  }, []);

  // Neural Particle Canvas Web Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1.2,
      color: Math.random() > 0.3 ? 'rgba(249, 115, 22, ' : 'rgba(56, 189, 248, '
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        const dxMouse = mousePos.current.x - p1.x;
        const dyMouse = mousePos.current.y - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 140) {
          p1.x += (dxMouse / distMouse) * 0.5;
          p1.y += (dyMouse / distMouse) * 0.5;
        }

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color + '0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#F97316';
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 130) * 0.22;
            ctx.strokeStyle = `rgba(249, 115, 22, ${alpha})`;
            ctx.lineWidth = 0.8;
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
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Form Submit
  const handleAuthSubmit = (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || 'Invalid root credentials.');
        triggerShake();
      } else if (res.user?.role !== 'super_admin') {
        setErrorMessage('Access Denied: Account lacks Super Admin privileges.');
        triggerShake();
      }
    }, 450);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // Password Security Strength Calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: 'Empty', color: '#71717A' };
    if (password.length < 6) return { score: 1, text: 'Low Security', color: '#EF4444' };
    if (password === 'admin123') return { score: 4, text: 'Super Admin Root Key', color: '#22C55E' };
    if (password.length >= 8) return { score: 3, text: 'Military Grade', color: '#38BDF8' };
    return { score: 2, text: 'Adequate', color: '#F59E0B' };
  };

  const strength = getPasswordStrength();

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#09090B',
      color: '#FAFAFA',
      position: 'relative',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Background Interactive Neural Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Cyber Grid Texture Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(249, 115, 22, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(249, 115, 22, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: 0.7,
        pointerEvents: 'none',
        zIndex: 2
      }} />

      {/* Ambient Pulsing Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.18) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 2,
        animation: 'pulseGlowOrange 6s infinite ease-in-out'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '20%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 2
      }} />

      {/* Top Floating Cyber HUD Bar */}
      <header style={{
        position: 'absolute',
        top: '20px',
        left: '24px',
        right: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        {/* Back to Store Action */}
        <button
          onClick={navigateToStorefront}
          style={{
            background: 'rgba(24, 24, 27, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#E4E4E7',
            padding: '8px 18px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#F97316';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(249, 115, 22, 0.35)';
            e.currentTarget.style.transform = 'translateX(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Storefront Preview</span>
        </button>

        {/* Live System Diagnostics HUD Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(18, 18, 22, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '6px 16px',
          borderRadius: '30px',
          backdropFilter: 'blur(12px)',
          fontSize: '0.75rem',
          color: '#A1A1AA'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              boxShadow: '0 0 8px #22C55E'
            }}></span>
            <span style={{ color: '#22C55E', fontWeight: '700' }}>ONLINE</span>
          </div>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>{currentTime}</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ color: '#38BDF8' }}>⚡ {pingMs}ms</span>

          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#D4D4D8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              marginLeft: '4px'
            }}
            title="Toggle theme mode"
          >
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Glass HUD Login Container */}
      <div
        className={`cyber-hud-card ${isShaking ? 'admin-login-card-shake' : ''}`}
        style={{
          width: '100%',
          maxWidth: '460px',
          margin: '90px 20px 40px',
          borderRadius: '20px',
          padding: '36px 36px 32px',
          zIndex: 5,
          position: 'relative',
          boxSizing: 'border-box'
        }}
      >
        {/* Tactical Corner Accents */}
        <div className="hud-corner hud-corner-tl"></div>
        <div className="hud-corner hud-corner-tr"></div>
        <div className="hud-corner hud-corner-bl"></div>
        <div className="hud-corner hud-corner-br"></div>

        {/* Portal Shield Hologram Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative' }}>
          {/* Animated Double Rotating Ring */}
          <div style={{
            position: 'relative',
            width: '84px',
            height: '84px',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Outer Ring */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                animation: 'spinClockwise 12s linear infinite'
              }}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#F97316"
                strokeWidth="2"
                strokeDasharray="25 15 10 15"
                strokeOpacity="0.75"
              />
            </svg>

            {/* Inner Counter Ring */}
            <svg
              style={{
                position: 'absolute',
                inset: '6px',
                width: 'calc(100% - 12px)',
                height: 'calc(100% - 12px)',
                animation: 'spinCounter 8s linear infinite'
              }}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeDasharray="18 12 30 10"
                strokeOpacity="0.65"
              />
            </svg>

            {/* Glowing Center Badge */}
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #9A3412 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(249, 115, 22, 0.65)',
              zIndex: 2
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
          </div>

          {/* Title & Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(249, 115, 22, 0.12)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: '20px',
            padding: '3px 12px',
            fontSize: '0.72rem',
            fontWeight: '700',
            color: '#F97316',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#F97316',
              boxShadow: '0 0 6px #F97316'
            }}></span>
            <span>RESTRICTED GATEWAY</span>
          </div>

          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            margin: '4px 0 6px',
            color: '#FFFFFF'
          }}>
            CREOTEX <span style={{ color: '#F97316', textShadow: '0 0 16px rgba(249, 115, 22, 0.5)' }}>PORTAL</span>
          </h2>
          <p style={{
            fontSize: '0.82rem',
            color: '#A1A1AA',
            margin: 0
          }}>
            Root administration node for robotics inventory &amp; operations
          </p>
        </div>

        {/* Error Alert Box with Glowing Border */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.45)',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.25)',
            color: '#FCA5A5',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAuthSubmit}>
          {/* Email Field */}
          <div className="cyber-input-wrap" style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#D4D4D8',
              marginBottom: '6px'
            }}>
              Administrator Root ID
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@creotex.in"
                style={{
                  width: '100%',
                  padding: '13px 14px 13px 42px',
                  background: 'rgba(10, 10, 14, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#71717A',
                pointerEvents: 'none',
                display: 'flex'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="cyber-input-wrap" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#D4D4D8'
              }}>
                Master Encryption Key
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#F97316',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  padding: 0
                }}
              >
                {showPassword ? 'Hide Key' : 'Reveal Key'}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '13px 14px 13px 42px',
                  background: 'rgba(10, 10, 14, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#71717A',
                pointerEvents: 'none',
                display: 'flex'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>

            {/* Dynamic Password Strength Meter */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#A1A1AA', marginBottom: '4px' }}>
                <span>Security Cipher</span>
                <span style={{ color: strength.color, fontWeight: '700' }}>{strength.text}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                {[1, 2, 3, 4].map(idx => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      borderRadius: '2px',
                      background: idx <= strength.score ? strength.color : 'rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.3s ease',
                      boxShadow: idx <= strength.score ? `0 0 6px ${strength.color}` : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Clean "Login" Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="cyber-auth-btn"
            style={{
              width: '100%',
              padding: '14px',
              border: 'none',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: '700',
              letterSpacing: '0.02em',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 6px 20px rgba(249, 115, 22, 0.45)',
              marginTop: '12px'
            }}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTopColor: '#FFFFFF',
                  borderRadius: '50%',
                  animation: 'spinClockwise 0.8s linear infinite',
                  display: 'inline-block'
                }}></span>
                <span>Logging In...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <span>Login</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
