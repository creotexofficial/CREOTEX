import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    currentUser,
    login,
    signup,
    logout,
    updateProfile,
    navigateToAdmin,
    theme
  } = useCart();

  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('signup'); // 'login' | 'signup' | 'profile'
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Profile edit state
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    city: '',
    tier: 'Student Maker'
  });

  const canvasRef = useRef(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  // Neural Particle Canvas Web in Auth Backdrop
  useEffect(() => {
    if (!isAuthModalOpen) return;

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

    // Particles
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      radius: Math.random() * 2 + 1.2,
      color: Math.random() > 0.35
        ? (isDark ? 'rgba(249, 115, 22, ' : 'rgba(234, 88, 12, ')
        : (isDark ? 'rgba(56, 189, 248, ' : 'rgba(2, 132, 199, ')
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        // Mouse attraction
        const dxMouse = mousePos.current.x - p1.x;
        const dyMouse = mousePos.current.y - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 150) {
          p1.x += (dxMouse / distMouse) * 0.45;
          p1.y += (dyMouse / distMouse) * 0.45;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color + (isDark ? '0.8)' : '0.6)');
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.shadowColor = '#F97316';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 130) * (isDark ? 0.22 : 0.14);
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
  }, [isAuthModalOpen, isDark]);

  useEffect(() => {
    if (currentUser) {
      setActiveTab('profile');
      setProfileData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        city: currentUser.city || '',
        tier: currentUser.tier || 'Student Maker'
      });
    } else {
      setActiveTab(authModalMode === 'login' ? 'login' : 'signup');
      setErrorMessage('');
    }
  }, [currentUser, authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || 'Invalid email or password.');
        triggerShake();
      }
    }, 400);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = signup({
        name: fullName.trim(),
        email: email.trim(),
        password: password,
        phone: phone.trim() || '+91 98765 00000',
        city: 'India',
        tier: 'Student Maker'
      });
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || 'Registration failed.');
        triggerShake();
      }
    }, 400);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(profileData);
  };

  return (
    <div
      className="modal-backdrop active"
      id="auth-modal"
      onClick={(e) => {
        if (e.target.id === 'auth-modal') closeAuthModal();
      }}
      style={{
        background: isDark ? 'rgba(5, 5, 8, 0.88)' : 'rgba(240, 240, 245, 0.82)',
        backdropFilter: 'blur(18px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        transition: 'background 0.3s ease'
      }}
    >
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
        backgroundImage: isDark
          ? `linear-gradient(to right, rgba(249, 115, 22, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(249, 115, 22, 0.045) 1px, transparent 1px)`
          : `linear-gradient(to right, rgba(234, 88, 12, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(234, 88, 12, 0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        opacity: isDark ? 0.7 : 0.5,
        pointerEvents: 'none',
        zIndex: 2
      }} />

      {/* Ambient Pulsing Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '22%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(249, 115, 22, 0.18) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, transparent 70%)',
        filter: 'blur(55px)',
        pointerEvents: 'none',
        zIndex: 2,
        animation: 'pulseGlowOrange 6s infinite ease-in-out'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '12%',
        right: '22%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(2, 132, 199, 0.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 2
      }} />

      {/* Main Card (Auto adapts to Dark & Light mode) */}
      <div
        className={`auth-card-modal ${isShaking ? 'admin-login-card-shake' : ''}`}
        style={{
          width: '100%',
          maxWidth: '380px',
          borderRadius: '28px',
          background: isDark ? 'rgba(22, 22, 28, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          border: isDark ? '1px solid rgba(249, 115, 22, 0.28)' : '1px solid rgba(249, 115, 22, 0.35)',
          boxShadow: isDark
            ? '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 35px rgba(249, 115, 22, 0.18)'
            : '0 20px 50px rgba(0, 0, 0, 0.12), 0 0 30px rgba(249, 115, 22, 0.12)',
          padding: '36px 28px 30px',
          position: 'relative',
          boxSizing: 'border-box',
          backdropFilter: 'blur(20px)',
          fontFamily: "'Inter', sans-serif",
          zIndex: 5,
          transition: 'all 0.3s ease'
        }}
      >
        {/* Top Right Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            color: isDark ? '#A1A1AA' : '#71717A',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#F97316';
            e.currentTarget.style.borderColor = '#F97316';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isDark ? '#A1A1AA' : '#71717A';
            e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
          }}
        >
          ✕
        </button>

        {/* 1. SIGN UP & LOGIN VIEWS */}
        {!currentUser && (
          <div>
            {/* Top Centered Circular Logo Badge */}
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{
                position: 'relative',
                width: '68px',
                height: '68px',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Rotating Cyber Ring */}
                <svg
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    animation: 'spinClockwise 10s linear infinite'
                  }}
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="2.5"
                    strokeDasharray="25 15 10 15"
                    strokeOpacity="0.85"
                  />
                </svg>

                {/* Center Circle Icon */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #9A3412 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 0 20px rgba(249, 115, 22, 0.55)',
                  zIndex: 2
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 style={{
                margin: '0 0 6px',
                fontSize: '1.55rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                color: isDark ? '#FFFFFF' : '#18181B'
              }}>
                Creotex <span style={{ color: '#F97316' }}>Shop</span>
              </h2>

              {/* Subtitle */}
              <p style={{
                margin: '0 0 14px',
                fontSize: '0.84rem',
                color: isDark ? '#A1A1AA' : '#52525B',
                lineHeight: '1.4'
              }}>
                {activeTab === 'signup'
                  ? 'Create an account to enjoy your maker kit'
                  : 'Welcome back! Sign in to your maker account'}
              </p>

              {/* Decorative Line Accent */}
              <div style={{
                width: '44px',
                height: '2px',
                background: 'rgba(249, 115, 22, 0.6)',
                margin: '0 auto',
                borderRadius: '2px'
              }} />
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div style={{
                background: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: isDark ? '#FCA5A5' : '#DC2626',
                padding: '9px 12px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ================= SIGN UP FORM ================= */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit}>
                {/* Full Name */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: isDark ? '#E4E4E7' : '#27272A',
                    marginBottom: '7px'
                  }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="Vikram Sharma"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '13px 14px 13px 44px',
                        background: isDark ? 'rgba(10, 10, 14, 0.85)' : '#F4F4F5',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #D4D4D8',
                        borderRadius: '12px',
                        color: isDark ? '#FFFFFF' : '#18181B',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s, box-shadow 0.2s'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = '#F97316';
                        e.target.style.boxShadow = '0 0 12px rgba(249, 115, 22, 0.25)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#D4D4D8';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isDark ? '#71717A' : '#71717A',
                      pointerEvents: 'none',
                      display: 'flex'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: isDark ? '#E4E4E7' : '#27272A',
                    marginBottom: '7px'
                  }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="vikram@maker.in"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '13px 14px 13px 44px',
                        background: isDark ? 'rgba(10, 10, 14, 0.85)' : '#F4F4F5',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #D4D4D8',
                        borderRadius: '12px',
                        color: isDark ? '#FFFFFF' : '#18181B',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s, box-shadow 0.2s'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = '#F97316';
                        e.target.style.boxShadow = '0 0 12px rgba(249, 115, 22, 0.25)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#D4D4D8';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isDark ? '#71717A' : '#71717A',
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

                {/* Phone / Mobile Number */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: isDark ? '#E4E4E7' : '#27272A',
                    marginBottom: '7px'
                  }}>
                    Phone / Mobile Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '13px 14px 13px 44px',
                        background: isDark ? 'rgba(10, 10, 14, 0.85)' : '#F4F4F5',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #D4D4D8',
                        borderRadius: '12px',
                        color: isDark ? '#FFFFFF' : '#18181B',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s, box-shadow 0.2s'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = '#F97316';
                        e.target.style.boxShadow = '0 0 12px rgba(249, 115, 22, 0.25)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#D4D4D8';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isDark ? '#71717A' : '#71717A',
                      pointerEvents: 'none',
                      display: 'flex'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: isDark ? '#E4E4E7' : '#27272A',
                    marginBottom: '7px'
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '13px 44px 13px 44px',
                        background: isDark ? 'rgba(10, 10, 14, 0.85)' : '#F4F4F5',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #D4D4D8',
                        borderRadius: '12px',
                        color: isDark ? '#FFFFFF' : '#18181B',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s, box-shadow 0.2s'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = '#F97316';
                        e.target.style.boxShadow = '0 0 12px rgba(249, 115, 22, 0.25)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#D4D4D8';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {/* Left Lock Icon */}
                    <div style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isDark ? '#71717A' : '#71717A',
                      pointerEvents: 'none',
                      display: 'flex'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    {/* Right Eye Button (Aankh) */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: showPassword ? '#F97316' : (isDark ? '#71717A' : '#9CA3AF'),
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px'
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="cyber-auth-btn"
                  style={{
                    width: '100%',
                    padding: '13px',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.94rem',
                    fontWeight: '700',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 20px rgba(249, 115, 22, 0.45)',
                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
                  }}
                >
                  {isLoading ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                      <span>Sign Up</span>
                    </>
                  )}
                </button>

                {/* Bottom Switcher */}
                <div style={{
                  textAlign: 'center',
                  marginTop: '20px',
                  fontSize: '0.84rem',
                  color: isDark ? '#A1A1AA' : '#71717A'
                }}>
                  Already have an account?{' '}
                  <span
                    style={{
                      color: '#F97316',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px'
                    }}
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMessage('');
                    }}
                  >
                    Login
                  </span>
                </div>
              </form>
            )}

            {/* ================= LOGIN FORM ================= */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                {/* Email Address */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: isDark ? '#E4E4E7' : '#27272A',
                    marginBottom: '7px'
                  }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="name@maker.in"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '13px 14px 13px 44px',
                        background: isDark ? 'rgba(10, 10, 14, 0.85)' : '#F4F4F5',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #D4D4D8',
                        borderRadius: '12px',
                        color: isDark ? '#FFFFFF' : '#18181B',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s, box-shadow 0.2s'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = '#F97316';
                        e.target.style.boxShadow = '0 0 12px rgba(249, 115, 22, 0.25)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#D4D4D8';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isDark ? '#71717A' : '#71717A',
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

                {/* Password */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: isDark ? '#E4E4E7' : '#27272A',
                    marginBottom: '7px'
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '13px 44px 13px 44px',
                        background: isDark ? 'rgba(10, 10, 14, 0.85)' : '#F4F4F5',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #D4D4D8',
                        borderRadius: '12px',
                        color: isDark ? '#FFFFFF' : '#18181B',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s, box-shadow 0.2s'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = '#F97316';
                        e.target.style.boxShadow = '0 0 12px rgba(249, 115, 22, 0.25)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#D4D4D8';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {/* Left Lock Icon */}
                    <div style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isDark ? '#71717A' : '#71717A',
                      pointerEvents: 'none',
                      display: 'flex'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    {/* Right Eye Button (Aankh) */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: showPassword ? '#F97316' : (isDark ? '#71717A' : '#9CA3AF'),
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px'
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="cyber-auth-btn"
                  style={{
                    width: '100%',
                    padding: '13px',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.94rem',
                    fontWeight: '700',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 20px rgba(249, 115, 22, 0.45)',
                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
                  }}
                >
                  {isLoading ? (
                    <span>Logging In...</span>
                  ) : (
                    <>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                      <span>Login</span>
                    </>
                  )}
                </button>

                {/* Bottom Switcher */}
                <div style={{
                  textAlign: 'center',
                  marginTop: '20px',
                  fontSize: '0.84rem',
                  color: isDark ? '#A1A1AA' : '#71717A'
                }}>
                  Don't have an account?{' '}
                  <span
                    style={{
                      color: '#F97316',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px'
                    }}
                    onClick={() => {
                      setActiveTab('signup');
                      setErrorMessage('');
                    }}
                  >
                    Sign Up
                  </span>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 2. PROFILE VIEW (WHEN LOGGED IN) */}
        {currentUser && (
          <div>
            {/* Top Avatar */}
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: currentUser.role === 'super_admin'
                  ? 'linear-gradient(135deg, #F97316, #EA580C)'
                  : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: '#FFFFFF',
                fontSize: '1.3rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)'
              }}>
                {currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'U'}
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: '800', color: isDark ? '#FFFFFF' : '#18181B' }}>
                {currentUser.name}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: isDark ? '#A1A1AA' : '#71717A' }}>
                {currentUser.email}
              </p>
            </div>

            {/* Super Admin Shortcut if Admin */}
            {currentUser.role === 'super_admin' && (
              <div style={{
                background: isDark ? 'rgba(249, 115, 22, 0.12)' : '#FFF7ED',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#F97316', fontSize: '0.86rem' }}>
                    Super Admin Access
                  </div>
                  <div style={{ fontSize: '0.72rem', color: isDark ? '#A1A1AA' : '#71717A' }}>
                    Manage store catalog &amp; orders
                  </div>
                </div>
                <button
                  className="cyber-auth-btn"
                  style={{ padding: '6px 12px', fontSize: '0.76rem', borderRadius: '8px', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
                  onClick={() => {
                    closeAuthModal();
                    navigateToAdmin('dashboard');
                  }}
                >
                  Open Suite →
                </button>
              </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleProfileSave}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: isDark ? '#D4D4D8' : '#374151', marginBottom: '5px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: isDark ? 'rgba(10, 10, 14, 0.85)' : '#F4F4F5',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #D4D4D8',
                    borderRadius: '10px',
                    color: isDark ? '#FFFFFF' : '#18181B',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: isDark ? '#D4D4D8' : '#374151', marginBottom: '5px' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: isDark ? 'rgba(10, 10, 14, 0.85)' : '#F4F4F5',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #D4D4D8',
                    borderRadius: '10px',
                    color: isDark ? '#FFFFFF' : '#18181B',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="submit"
                  className="cyber-auth-btn"
                  style={{ flex: 1, padding: '11px', border: 'none', borderRadius: '10px', color: '#FFFFFF', fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  style={{
                    background: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#EF4444',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={logout}
                >
                  Log Out
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
