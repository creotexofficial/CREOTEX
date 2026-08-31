import React, { useState, useEffect } from 'react';

/**
 * CreotexShop - Real Product Image URLs Mapping
 * High-definition, authentic photographs for each robotics & maker component.
 */
export const REAL_PRODUCT_IMAGE_URLS = {
  // 1. FASTENERS & HARDWARE
  "fasteners-m3-kit": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
  "fasteners-brass-standoff": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
  "fasteners-m4-black": "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&auto=format&fit=crop&q=80",
  "fasteners-m5-washers": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",

  // 2. 3D PRINTING & FILAMENTS
  "filament-hyper-pla": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",
  "filaments-pla-black": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",
  "filament-petg-cf": "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&auto=format&fit=crop&q=80",
  "filaments-petg-cf": "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&auto=format&fit=crop&q=80",
  "filament-tpu": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80",
  "filaments-tpu-orange": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80",
  "nozzle-set": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
  "filaments-steel-nozzles": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",

  // 3. GEARBOX & MOTORS
  "motor-planetary-pg36": "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
  "motor-pg36-12v": "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
  "motor-nema17": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
  "motor-nema17-stepper": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
  "motor-n20-encoder": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
  "motor-mg996r": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80",
  "motor-servo-mg996r": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80",
  "motor-bldc-2212": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
  "motor-bldc-a2212": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",

  // 4. MOTOR DRIVERS & CONTROLLERS
  "driver-cytron-mdd10a": "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&auto=format&fit=crop&q=80",
  "driver-tb6612": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
  "driver-tb6612fng": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
  "driver-tmc2209": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
  "driver-bldc-esc40": "https://images.unsplash.com/photo-1608555855762-2b657eb1c348?w=600&auto=format&fit=crop&q=80",
  "driver-esc-40a": "https://images.unsplash.com/photo-1608555855762-2b657eb1c348?w=600&auto=format&fit=crop&q=80",

  // 5. BEARINGS & LINEAR MOTION
  "bearing-608zz": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
  "bearings-608zz": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
  "bearing-lm8uu": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
  "bearings-lm8uu": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
  "motion-t8-screw": "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
  "bearings-t8-leadscrew": "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
  "bearing-kfl08": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
  "bearings-kfl08": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",

  // 6. LINE FOLLOWER ROBOT KITS
  "kit-lfr-pro": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
  "sensor-qtr8rc": "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600&auto=format&fit=crop&q=80",
  "kit-lfr-qtr8rc": "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600&auto=format&fit=crop&q=80",
  "kit-lfr-starter": "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=600&auto=format&fit=crop&q=80",

  // 7. ROBO RACE CHASSIS & WHEELS
  "chassis-carbon-race": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
  "race-chassis-carbon": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
  "wheel-silicone-race": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80",
  "race-wheels-silicone": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80",
  "wheel-rubber-80": "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
  "race-wheels-monster": "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
  "coupler-brass-hex": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
  "race-hub-brass": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",

  // 8. SOCCER ROBOT CHASSIS & ACCESSORIES
  "chassis-soccer-omni": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
  "soccer-chassis-3omni": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
  "wheel-mecanum-60": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
  "soccer-wheels-mecanum": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
  "wheel-omni-100": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80",
  "soccer-wheels-omni100": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80",
  "kicker-solenoid-12v": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
  "soccer-solenoid-kicker": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",

  // 9. POWER & SENSORS
  "battery-lipo-3s": "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80",
  "power-lipo-3s": "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80",
  "sensor-mpu6050": "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&auto=format&fit=crop&q=80",
  "sensor-imu-mpu6050": "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&auto=format&fit=crop&q=80",
  "sensor-ultrasonic": "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600&auto=format&fit=crop&q=80",
  "sensor-sonar-hcsr04": "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600&auto=format&fit=crop&q=80"
};

// Helper to sanitize & extract valid image URL
export const resolveImageUrl = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();

  // If Data URL or Blob URL
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // If already absolute HTTP / HTTPS URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//') || trimmed.startsWith('/')) {
    return trimmed.startsWith('//') ? `https:${trimmed}` : trimmed;
  }

  // If mapped key in REAL_PRODUCT_IMAGE_URLS
  if (REAL_PRODUCT_IMAGE_URLS[trimmed]) {
    return REAL_PRODUCT_IMAGE_URLS[trimmed];
  }

  // If user pasted something like 'www.google.com/...' or 'images.unsplash.com/...'
  if (trimmed.includes('.') && (trimmed.startsWith('www.') || trimmed.includes('/') || trimmed.endsWith('.jpg') || trimmed.endsWith('.png') || trimmed.endsWith('.webp') || trimmed.endsWith('.jpeg'))) {
    return `https://${trimmed.replace(/^https?:\/\//, '')}`;
  }

  return null;
};

export const ProductImage = ({ type, className = "product-svg-img" }) => {
  const [loadError, setLoadError] = useState(false);

  // Automatically reset load error whenever image source type or URL changes
  useEffect(() => {
    setLoadError(false);
  }, [type]);

  const resolvedUrl = resolveImageUrl(type);

  if (resolvedUrl && !loadError) {
    return (
      <img
        src={resolvedUrl}
        alt="Product"
        className={className}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => {
          setLoadError(true);
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    );
  }

  return renderFallbackSvg(type, className);
};

const renderFallbackSvg = (type, className) => {
  switch (type) {
    // 1. FASTENERS & HARDWARE
    case "fasteners-m3-kit":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="url(#bg-fast-grad)"/>
          <rect x="40" y="50" width="220" height="140" rx="12" fill="#1E293B" stroke="#475569" strokeWidth="3"/>
          <line x1="40" y1="120" x2="260" y2="120" stroke="#334155" strokeWidth="2"/>
          <line x1="113" y1="50" x2="113" y2="190" stroke="#334155" strokeWidth="2"/>
          <line x1="186" y1="50" x2="186" y2="190" stroke="#334155" strokeWidth="2"/>
          <circle cx="75" cy="85" r="14" fill="#94A3B8"/>
          <polygon points="75,76 81,80 81,90 75,94 69,90 69,80" fill="#0F172A"/>
          <rect x="73" y="140" width="6" height="30" rx="2" fill="#CBD5E1"/>
          <circle cx="76" cy="138" r="8" fill="#94A3B8"/>
          <rect x="145" y="65" width="8" height="40" rx="2" fill="#CBD5E1"/>
          <circle cx="149" cy="62" r="10" fill="#94A3B8"/>
          <polygon points="149,56 154,59 154,65 149,68 144,65 144,59" fill="#0F172A"/>
          <rect x="145" y="130" width="8" height="45" rx="2" fill="#CBD5E1"/>
          <circle cx="149" cy="127" r="10" fill="#94A3B8"/>
          <polygon points="223,75 233,81 233,93 223,99 213,93 213,81" fill="#94A3B8"/>
          <circle cx="223" cy="87" r="5" fill="#0F172A"/>
          <circle cx="223" cy="155" r="15" stroke="#94A3B8" strokeWidth="5" fill="none"/>
          <circle cx="223" cy="155" r="7" fill="#0F172A"/>
          <rect x="90" y="200" width="120" height="24" rx="12" fill="#0066FF" fillOpacity="0.2" stroke="#0066FF" strokeWidth="1"/>
          <text x="150" y="216" fill="#00F0FF" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">M3 STAINLESS 304</text>
          <defs>
            <linearGradient id="bg-fast-grad" x1="0" y1="0" x2="300" y2="240" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0F172A"/>
              <stop offset="1" stopColor="#1E293B"/>
            </linearGradient>
          </defs>
        </svg>
      );

    case "fasteners-brass-standoff":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <g transform="translate(60, 45)">
            <rect x="0" y="20" width="22" height="90" rx="2" fill="url(#brass-grad)"/>
            <rect x="7" y="110" width="8" height="25" fill="#B45309"/>
            <polygon points="0,20 11,10 22,20 11,30" fill="#FDE68A"/>
            <rect x="45" y="45" width="22" height="65" rx="2" fill="url(#brass-grad)"/>
            <rect x="52" y="110" width="8" height="25" fill="#B45309"/>
            <polygon points="45,45 56,35 67,45 56,55" fill="#FDE68A"/>
            <rect x="90" y="70" width="22" height="40" rx="2" fill="url(#brass-grad)"/>
            <rect x="97" y="110" width="8" height="25" fill="#B45309"/>
            <polygon points="90,70 101,60 112,70 101,80" fill="#FDE68A"/>
            <rect x="135" y="45" width="22" height="65" rx="2" fill="url(#brass-grad)"/>
            <circle cx="146" cy="55" r="5" fill="#78350F"/>
            <circle cx="146" cy="100" r="5" fill="#78350F"/>
          </g>
          <rect x="80" y="195" width="140" height="26" rx="13" fill="#D97706" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1"/>
          <text x="150" y="213" fill="#FBBF24" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">M2/M3 BRASS 180PCS</text>
          <defs>
            <linearGradient id="brass-grad" x1="0" y1="0" x2="22" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A"/>
              <stop offset="0.5" stopColor="#F59E0B"/>
              <stop offset="1" stopColor="#D97706"/>
            </linearGradient>
          </defs>
        </svg>
      );

    case "fasteners-m4-black":
    case "fasteners-m5-washers":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0F172A"/>
          <g transform="translate(60, 40)">
            <circle cx="50" cy="50" r="35" fill="url(#cyan-washer-grad)"/>
            <circle cx="50" cy="50" r="14" fill="#0F172A"/>
            <circle cx="130" cy="50" r="35" fill="url(#red-washer-grad)"/>
            <circle cx="130" cy="50" r="14" fill="#0F172A"/>
            <rect x="44" y="100" width="12" height="45" rx="3" fill="#334155"/>
            <polygon points="50,90 62,96 62,108 50,114 38,108 38,96" fill="#1E293B"/>
            <circle cx="50" cy="102" r="4" fill="#64748B"/>
            <rect x="124" y="100" width="12" height="45" rx="3" fill="#334155"/>
            <polygon points="130,90 142,96 142,108 130,114 118,108 118,96" fill="#1E293B"/>
            <circle cx="130" cy="102" r="4" fill="#64748B"/>
          </g>
          <rect x="75" y="200" width="150" height="24" rx="12" fill="#00F0FF" fillOpacity="0.15" stroke="#00F0FF" strokeWidth="1"/>
          <text x="150" y="216" fill="#00F0FF" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">CNC ALLOY ANODIZED</text>
          <defs>
            <linearGradient id="cyan-washer-grad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00F0FF"/>
              <stop offset="1" stopColor="#0066FF"/>
            </linearGradient>
            <linearGradient id="red-washer-grad" x1="95" y1="15" x2="165" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF3366"/>
              <stop offset="1" stopColor="#BE123C"/>
            </linearGradient>
          </defs>
        </svg>
      );

    // 2. 3D PRINTER FILAMENTS
    case "filament-hyper-pla":
    case "filament-petg-cf":
    case "filament-tpu": {
      const spoolColor = type === "filament-hyper-pla" ? "#00F0FF" : (type === "filament-petg-cf" ? "#64748B" : "#FF6600");
      const spoolLabel = type === "filament-hyper-pla" ? "HYPER PLA 600mm/s" : (type === "filament-petg-cf" ? "PETG-CF CARBON 1KG" : "FLEX TPU 95A");
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <ellipse cx="150" cy="115" rx="85" ry="60" fill="#1E293B" stroke="#334155" strokeWidth="4"/>
          <ellipse cx="150" cy="115" rx="72" ry="48" fill={spoolColor} fillOpacity="0.85"/>
          <path d="M 85 115 A 65 42 0 0 0 215 115" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.3" fill="none"/>
          <path d="M 90 108 A 60 38 0 0 0 210 108" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
          <path d="M 95 122 A 55 35 0 0 0 205 122" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.3" fill="none"/>
          <ellipse cx="150" cy="115" rx="30" ry="20" fill="#0F172A" stroke="#475569" strokeWidth="3"/>
          <circle cx="120" cy="100" r="8" fill="#1E293B"/>
          <circle cx="180" cy="100" r="8" fill="#1E293B"/>
          <circle cx="150" cy="80" r="8" fill="#1E293B"/>
          <path d="M 215 105 Q 240 70 260 85" stroke={spoolColor} strokeWidth="4" strokeLinecap="round" fill="none"/>
          <rect x="65" y="195" width="170" height="26" rx="13" fill={spoolColor} fillOpacity="0.15" stroke={spoolColor} strokeWidth="1"/>
          <text x="150" y="213" fill={spoolColor} fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">{spoolLabel}</text>
        </svg>
      );
    }

    case "nozzle-set":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0F172A"/>
          <g transform="translate(45, 50)">
            <path d="M 30 20 L 50 20 L 50 50 L 45 75 L 42 85 L 38 85 L 35 75 L 30 50 Z" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="2"/>
            <line x1="30" y1="30" x2="50" y2="30" stroke="#475569" strokeWidth="2"/>
            <line x1="30" y1="40" x2="50" y2="40" stroke="#475569" strokeWidth="2"/>
            <circle cx="40" cy="85" r="1.5" fill="#0F172A"/>
            <text x="40" y="110" fill="#94A3B8" fontSize="10" fontFamily="'JetBrains Mono'" textAnchor="middle">0.4mm</text>
            <path d="M 100 10 L 120 10 L 120 60 L 115 85 L 112 95 L 108 95 L 105 85 L 100 60 Z" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2"/>
            <line x1="100" y1="25" x2="120" y2="25" stroke="#78350F" strokeWidth="2"/>
            <line x1="100" y1="40" x2="120" y2="40" stroke="#78350F" strokeWidth="2"/>
            <line x1="100" y1="55" x2="120" y2="55" stroke="#78350F" strokeWidth="2"/>
            <circle cx="110" cy="95" r="2.5" fill="#0F172A"/>
            <text x="110" y="110" fill="#FBBF24" fontSize="10" fontFamily="'JetBrains Mono'" textAnchor="middle">0.6mm</text>
            <path d="M 170 20 L 190 20 L 190 50 L 185 75 L 182 85 L 178 85 L 175 75 L 170 50 Z" fill="#334155" stroke="#64748B" strokeWidth="2"/>
            <line x1="170" y1="30" x2="190" y2="30" stroke="#1E293B" strokeWidth="2"/>
            <line x1="170" y1="40" x2="190" y2="40" stroke="#1E293B" strokeWidth="2"/>
            <circle cx="180" cy="85" r="3.5" fill="#0F172A"/>
            <text x="180" y="110" fill="#94A3B8" fontSize="10" fontFamily="'JetBrains Mono'" textAnchor="middle">0.8mm</text>
          </g>
          <rect x="75" y="195" width="150" height="26" rx="13" fill="#38BDF8" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1"/>
          <text x="150" y="213" fill="#38BDF8" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">HARDENED STEEL NOZZLES</text>
        </svg>
      );

    // 3. GEARBOX & MOTORS
    case "motor-planetary-pg36":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <g transform="translate(30, 70)">
            <rect x="15" y="15" width="80" height="70" rx="8" fill="#1E293B" stroke="#00F0FF" strokeWidth="2"/>
            <rect x="0" y="30" width="15" height="8" fill="#EF4444" rx="2"/>
            <rect x="0" y="60" width="15" height="8" fill="#3B82F6" rx="2"/>
            <rect x="95" y="10" width="75" height="80" rx="6" fill="#334155" stroke="#94A3B8" strokeWidth="3"/>
            <rect x="170" y="5" width="12" height="90" rx="3" fill="#475569" stroke="#64748B" strokeWidth="2"/>
            <rect x="182" y="40" width="55" height="20" rx="2" fill="#E2E8F0"/>
            <line x1="182" y1="44" x2="237" y2="44" stroke="#94A3B8" strokeWidth="2"/>
            <line x1="35" y1="25" x2="35" y2="75" stroke="#0F172A" strokeWidth="3"/>
            <line x1="50" y1="25" x2="50" y2="75" stroke="#0F172A" strokeWidth="3"/>
            <line x1="65" y1="25" x2="65" y2="75" stroke="#0F172A" strokeWidth="3"/>
          </g>
          <rect x="70" y="195" width="160" height="26" rx="13" fill="#0066FF" fillOpacity="0.2" stroke="#0066FF" strokeWidth="1"/>
          <text x="150" y="213" fill="#00F0FF" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">PG36 PLANETARY 600RPM</text>
        </svg>
      );

    case "motor-nema17":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0F172A"/>
          <g transform="translate(90, 45)">
            <rect x="0" y="15" width="110" height="110" rx="10" fill="#1E293B" stroke="#64748B" strokeWidth="3"/>
            <circle cx="15" cy="30" r="5" fill="#0F172A" stroke="#94A3B8" strokeWidth="2"/>
            <circle cx="95" cy="30" r="5" fill="#0F172A" stroke="#94A3B8" strokeWidth="2"/>
            <circle cx="15" cy="110" r="5" fill="#0F172A" stroke="#94A3B8" strokeWidth="2"/>
            <circle cx="95" cy="110" r="5" fill="#0F172A" stroke="#94A3B8" strokeWidth="2"/>
            <circle cx="55" cy="70" r="30" fill="#334155" stroke="#94A3B8" strokeWidth="2"/>
            <circle cx="55" cy="70" r="10" fill="#E2E8F0"/>
            <path d="M 52 60 L 58 60 L 58 70 L 52 70 Z" fill="#94A3B8"/>
          </g>
          <rect x="75" y="195" width="150" height="26" rx="13" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1"/>
          <text x="150" y="213" fill="#10B981" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">NEMA 17 STEPPER 59Ncm</text>
        </svg>
      );

    case "motor-n20-encoder":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <g transform="translate(40, 75)">
            <rect x="0" y="15" width="25" height="50" rx="4" fill="#059669" stroke="#10B981" strokeWidth="1.5"/>
            <circle cx="12" cy="40" r="8" fill="#1E293B"/>
            <rect x="25" y="20" width="70" height="40" rx="4" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="2"/>
            <rect x="95" y="15" width="45" height="50" rx="3" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2"/>
            <rect x="140" y="34" width="55" height="12" rx="2" fill="#E2E8F0"/>
            <line x1="140" y1="36" x2="195" y2="36" stroke="#94A3B8" strokeWidth="2"/>
          </g>
          <rect x="70" y="195" width="160" height="26" rx="13" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1"/>
          <text x="150" y="213" fill="#FBBF24" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">N20 ENCODER 1000RPM</text>
        </svg>
      );

    case "motor-mg996r":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0F172A"/>
          <g transform="translate(65, 50)">
            <rect x="20" y="20" width="110" height="85" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2"/>
            <rect x="0" y="40" width="20" height="45" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="2"/>
            <rect x="130" y="40" width="20" height="45" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="2"/>
            <circle cx="10" cy="50" r="4" fill="#0F172A"/>
            <circle cx="10" cy="75" r="4" fill="#0F172A"/>
            <circle cx="140" cy="50" r="4" fill="#0F172A"/>
            <circle cx="140" cy="75" r="4" fill="#0F172A"/>
            <circle cx="100" cy="20" r="22" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2"/>
            <circle cx="100" cy="20" r="9" fill="#78350F"/>
            <rect x="55" y="14" width="70" height="12" rx="6" fill="#E2E8F0"/>
          </g>
          <rect x="75" y="195" width="150" height="26" rx="13" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="1"/>
          <text x="150" y="213" fill="#F472B6" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">MG996R METAL 13KG</text>
        </svg>
      );

    case "motor-bldc-2212":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <g transform="translate(90, 50)">
            <polygon points="20,95 100,95 110,110 10,110" fill="#334155"/>
            <rect x="25" y="30" width="70" height="65" rx="12" fill="#E11D48" stroke="#FB7185" strokeWidth="2"/>
            <line x1="40" y1="40" x2="40" y2="80" stroke="#881337" strokeWidth="4"/>
            <line x1="60" y1="40" x2="60" y2="80" stroke="#881337" strokeWidth="4"/>
            <line x1="80" y1="40" x2="80" y2="80" stroke="#881337" strokeWidth="4"/>
            <polygon points="60,5 68,25 52,25" fill="#E2E8F0"/>
            <rect x="57" y="25" width="6" height="15" fill="#94A3B8"/>
          </g>
          <rect x="75" y="195" width="150" height="26" rx="13" fill="#E11D48" fillOpacity="0.15" stroke="#E11D48" strokeWidth="1"/>
          <text x="150" y="213" fill="#FB7185" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">BLDC A2212 1400KV</text>
        </svg>
      );

    // 4. MOTOR DRIVERS
    case "driver-cytron-mdd10a":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <g transform="translate(45, 35)">
            <rect x="0" y="0" width="210" height="140" rx="12" fill="#1E1B4B" stroke="#6366F1" strokeWidth="3"/>
            <rect x="15" y="10" width="40" height="30" rx="4" fill="#059669" stroke="#10B981" strokeWidth="2"/>
            <circle cx="25" cy="25" r="5" fill="#0F172A"/>
            <circle cx="45" cy="25" r="5" fill="#0F172A"/>
            <rect x="155" y="10" width="40" height="30" rx="4" fill="#059669" stroke="#10B981" strokeWidth="2"/>
            <circle cx="165" cy="25" r="5" fill="#0F172A"/>
            <circle cx="185" cy="25" r="5" fill="#0F172A"/>
            <rect x="65" y="50" width="80" height="45" rx="6" fill="#111827" stroke="#4B5563" strokeWidth="2"/>
            <text x="105" y="78" fill="#9CA3AF" fontSize="10" fontFamily="'JetBrains Mono'" textAnchor="middle">MOSFET H-BRIDGE</text>
            <circle cx="45" cy="110" r="10" fill="#DC2626"/>
            <circle cx="75" cy="110" r="10" fill="#DC2626"/>
            <circle cx="135" cy="110" r="10" fill="#DC2626"/>
            <circle cx="165" cy="110" r="10" fill="#DC2626"/>
          </g>
          <rect x="65" y="195" width="170" height="26" rx="13" fill="#6366F1" fillOpacity="0.2" stroke="#6366F1" strokeWidth="1"/>
          <text x="150" y="213" fill="#818CF8" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">CYTRON MDD10A 30A PEAK</text>
        </svg>
      );

    case "driver-tb6612":
    case "driver-tmc2209":
    case "driver-bldc-esc40":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0F172A"/>
          <g transform="translate(60, 45)">
            <rect x="0" y="0" width="180" height="120" rx="8" fill="#991B1B" stroke="#EF4444" strokeWidth="2"/>
            <rect x="50" y="35" width="80" height="50" rx="4" fill="#0F172A" stroke="#475569" strokeWidth="2"/>
            <circle cx="65" cy="48" r="3" fill="#94A3B8"/>
            <text x="90" y="65" fill="#F87171" fontSize="10" fontFamily="'JetBrains Mono'" textAnchor="middle">TB6612 / ESC</text>
            <g fill="#F59E0B">
              <rect x="15" y="5" width="10" height="12" rx="1"/>
              <rect x="35" y="5" width="10" height="12" rx="1"/>
              <rect x="55" y="5" width="10" height="12" rx="1"/>
              <rect x="75" y="5" width="10" height="12" rx="1"/>
              <rect x="95" y="5" width="10" height="12" rx="1"/>
              <rect x="115" y="5" width="10" height="12" rx="1"/>
              <rect x="135" y="5" width="10" height="12" rx="1"/>
              <rect x="155" y="5" width="10" height="12" rx="1"/>
              <rect x="15" y="103" width="10" height="12" rx="1"/>
              <rect x="35" y="103" width="10" height="12" rx="1"/>
              <rect x="55" y="103" width="10" height="12" rx="1"/>
              <rect x="75" y="103" width="10" height="12" rx="1"/>
              <rect x="95" y="103" width="10" height="12" rx="1"/>
              <rect x="115" y="103" width="10" height="12" rx="1"/>
              <rect x="135" y="103" width="10" height="12" rx="1"/>
              <rect x="155" y="103" width="10" height="12" rx="1"/>
            </g>
          </g>
          <rect x="75" y="195" width="150" height="26" rx="13" fill="#EF4444" fillOpacity="0.15" stroke="#EF4444" strokeWidth="1"/>
          <text x="150" y="213" fill="#F87171" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">DUAL MOSFET DRIVER</text>
        </svg>
      );

    // 5. BEARINGS & LINEAR MOTION
    case "bearing-608zz":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <g transform="translate(85, 30)">
            <circle cx="65" cy="65" r="65" fill="#334155" stroke="#94A3B8" strokeWidth="4"/>
            <circle cx="65" cy="65" r="52" fill="#1E293B" stroke="#64748B" strokeWidth="2"/>
            <circle cx="65" cy="65" r="30" fill="#475569" stroke="#CBD5E1" strokeWidth="3"/>
            <circle cx="65" cy="65" r="18" fill="#0B0F19"/>
            <path id="curve" d="M 30,65 A 35,35 0 0,1 100,65" fill="none"/>
            <text fontFamily="'JetBrains Mono'" fontSize="9" fill="#00F0FF" fontWeight="bold">
              <textPath href="#curve" startOffset="15%">608ZZ • ABEC-7</textPath>
            </text>
          </g>
          <rect x="80" y="195" width="140" height="26" rx="13" fill="#00F0FF" fillOpacity="0.15" stroke="#00F0FF" strokeWidth="1"/>
          <text x="150" y="213" fill="#00F0FF" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">608ZZ PRECISION 10X</text>
        </svg>
      );

    case "bearing-lm8uu":
    case "motion-t8-screw":
    case "bearing-kfl08":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0F172A"/>
          <g transform="translate(60, 50)">
            <rect x="20" y="15" width="140" height="60" rx="8" fill="#475569" stroke="#E2E8F0" strokeWidth="3"/>
            <line x1="20" y1="30" x2="160" y2="30" stroke="#94A3B8" strokeWidth="2"/>
            <line x1="20" y1="45" x2="160" y2="45" stroke="#94A3B8" strokeWidth="2"/>
            <line x1="20" y1="60" x2="160" y2="60" stroke="#94A3B8" strokeWidth="2"/>
            <rect x="40" y="10" width="6" height="70" fill="#0F172A"/>
            <rect x="134" y="10" width="6" height="70" fill="#0F172A"/>
          </g>
          <rect x="75" y="195" width="150" height="26" rx="13" fill="#94A3B8" fillOpacity="0.15" stroke="#94A3B8" strokeWidth="1"/>
          <text x="150" y="213" fill="#E2E8F0" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">LINEAR MOTION T8 / LM8</text>
        </svg>
      );

    // 6. LINE FOLLOWER & SENSORS
    case "kit-lfr-pro":
    case "kit-lfr-starter":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <g transform="translate(50, 25)">
            <rect x="20" y="10" width="160" height="16" rx="6" fill="#0066FF" stroke="#00F0FF" strokeWidth="2"/>
            <circle cx="35" cy="18" r="3" fill="#EF4444"/>
            <circle cx="55" cy="18" r="3" fill="#EF4444"/>
            <circle cx="75" cy="18" r="3" fill="#EF4444"/>
            <circle cx="95" cy="18" r="3" fill="#EF4444"/>
            <circle cx="115" cy="18" r="3" fill="#EF4444"/>
            <circle cx="135" cy="18" r="3" fill="#EF4444"/>
            <circle cx="155" cy="18" r="3" fill="#EF4444"/>
            <circle cx="170" cy="18" r="3" fill="#EF4444"/>
            <polygon points="50,26 150,26 180,120 20,120" fill="#1E293B" stroke="#00F0FF" strokeWidth="2"/>
            <rect x="75" y="45" width="50" height="30" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5"/>
            <text x="100" y="64" fill="#38BDF8" fontSize="8" fontFamily="'JetBrains Mono'" textAnchor="middle">PID: 98.4%</text>
            <rect x="0" y="85" width="22" height="40" rx="4" fill="#00F0FF"/>
            <rect x="178" y="85" width="22" height="40" rx="4" fill="#00F0FF"/>
          </g>
          <rect x="65" y="195" width="170" height="26" rx="13" fill="#00F0FF" fillOpacity="0.15" stroke="#00F0FF" strokeWidth="1"/>
          <text x="150" y="213" fill="#00F0FF" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">PHANTOM PRO LFR KIT</text>
        </svg>
      );

    case "sensor-qtr8rc":
    case "sensor-mpu6050":
    case "sensor-ultrasonic":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0F172A"/>
          <g transform="translate(30, 45)">
            <rect x="0" y="20" width="240" height="50" rx="8" fill="#1E293B" stroke="#10B981" strokeWidth="2"/>
            <g fill="#EF4444">
              <circle cx="25" cy="45" r="6"/>
              <circle cx="55" cy="45" r="6"/>
              <circle cx="85" cy="45" r="6"/>
              <circle cx="115" cy="45" r="6"/>
              <circle cx="145" cy="45" r="6"/>
              <circle cx="175" cy="45" r="6"/>
              <circle cx="205" cy="45" r="6"/>
              <circle cx="225" cy="45" r="6"/>
            </g>
            <circle cx="25" cy="30" r="2" fill="#10B981"/>
            <circle cx="85" cy="30" r="2" fill="#10B981"/>
            <circle cx="145" cy="30" r="2" fill="#10B981"/>
            <circle cx="205" cy="30" r="2" fill="#10B981"/>
          </g>
          <rect x="75" y="195" width="150" height="26" rx="13" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1"/>
          <text x="150" y="213" fill="#34D399" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">QTR-8RC SENSOR ARRAY</text>
        </svg>
      );

    // 7. ROBO RACE CHASSIS & WHEELS
    case "chassis-carbon-race":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <g transform="translate(60, 30)">
            <path d="M 40 10 L 140 10 L 170 60 L 180 130 L 0 130 L 10 60 Z" fill="#111827" stroke="#00F0FF" strokeWidth="2.5"/>
            <polygon points="60,35 120,35 135,70 45,70" fill="#0B0F19" stroke="#334155" strokeWidth="2"/>
            <polygon points="50,85 130,85 140,115 40,115" fill="#0B0F19" stroke="#334155" strokeWidth="2"/>
            <rect x="15" y="70" width="8" height="25" rx="3" fill="#00F0FF"/>
            <rect x="157" y="70" width="8" height="25" rx="3" fill="#00F0FF"/>
          </g>
          <rect x="65" y="195" width="170" height="26" rx="13" fill="#00F0FF" fillOpacity="0.15" stroke="#00F0FF" strokeWidth="1"/>
          <text x="150" y="213" fill="#00F0FF" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">3K CARBON FIBER CHASSIS</text>
        </svg>
      );

    case "wheel-silicone-race":
    case "wheel-rubber-80":
    case "coupler-brass-hex":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <g transform="translate(85, 30)">
            <circle cx="65" cy="65" r="65" fill="#0066FF" stroke="#00F0FF" strokeWidth="3"/>
            <g stroke="#38BDF8" strokeWidth="2">
              <line x1="65" y1="0" x2="65" y2="12"/>
              <line x1="130" y1="65" x2="118" y2="65"/>
              <line x1="65" y1="130" x2="65" y2="118"/>
              <line x1="0" y1="65" x2="12" y2="65"/>
              <line x1="20" y1="20" x2="28" y2="28"/>
              <line x1="110" y1="20" x2="102" y2="28"/>
              <line x1="20" y1="110" x2="28" y2="102"/>
              <line x1="110" y1="110" x2="102" y2="102"/>
            </g>
            <circle cx="65" cy="65" r="42" fill="#1E293B" stroke="#94A3B8" strokeWidth="3"/>
            <circle cx="45" cy="50" r="7" fill="#0B0F19"/>
            <circle cx="85" cy="50" r="7" fill="#0B0F19"/>
            <circle cx="65" cy="85" r="7" fill="#0B0F19"/>
            <polygon points="65,55 74,60 74,70 65,75 56,70 56,60" fill="#F59E0B" stroke="#FDE68A" strokeWidth="1.5"/>
            <circle cx="65" cy="65" r="4" fill="#0F172A"/>
          </g>
          <rect x="70" y="195" width="160" height="26" rx="13" fill="#0066FF" fillOpacity="0.2" stroke="#0066FF" strokeWidth="1"/>
          <text x="150" y="213" fill="#00F0FF" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">STICKY SILICONE 65MM</text>
        </svg>
      );

    // 8. SOCCER ROBOT CHASSIS & WHEELS & KICKER
    case "chassis-soccer-omni":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <g transform="translate(85, 30)">
            <circle cx="65" cy="65" r="65" fill="#1E293B" stroke="#38BDF8" strokeWidth="3"/>
            <rect x="52" y="-5" width="26" height="15" rx="3" fill="#00F0FF"/>
            <g transform="rotate(120 65 65)">
              <rect x="52" y="-5" width="26" height="15" rx="3" fill="#00F0FF"/>
            </g>
            <g transform="rotate(240 65 65)">
              <rect x="52" y="-5" width="26" height="15" rx="3" fill="#00F0FF"/>
            </g>
            <rect x="35" y="110" width="60" height="16" rx="4" fill="#EF4444" stroke="#F87171" strokeWidth="2"/>
            <circle cx="65" cy="65" r="22" fill="#0F172A" stroke="#475569" strokeWidth="2"/>
          </g>
          <rect x="65" y="195" width="170" height="26" rx="13" fill="#38BDF8" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1"/>
          <text x="150" y="213" fill="#38BDF8" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">TRI-OMNI SOCCER CHASSIS</text>
        </svg>
      );

    case "wheel-mecanum-60":
    case "wheel-omni-100":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0F172A"/>
          <g transform="translate(85, 30)">
            <circle cx="65" cy="65" r="60" fill="#1E293B" stroke="#64748B" strokeWidth="2"/>
            <g stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round">
              <line x1="45" y1="10" x2="85" y2="22"/>
              <line x1="98" y1="35" x2="120" y2="70"/>
              <line x1="110" y1="85" x2="85" y2="120"/>
              <line x1="45" y1="120" x2="10" y2="95"/>
              <line x1="10" y1="60" x2="25" y2="20"/>
            </g>
            <circle cx="65" cy="65" r="20" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2"/>
            <circle cx="65" cy="65" r="6" fill="#0F172A"/>
          </g>
          <rect x="70" y="195" width="160" height="26" rx="13" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1"/>
          <text x="150" y="213" fill="#FBBF24" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">60MM MECANUM CNC SET</text>
        </svg>
      );

    case "kicker-solenoid-12v":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <g transform="translate(50, 60)">
            <rect x="30" y="10" width="90" height="60" rx="6" fill="#334155" stroke="#94A3B8" strokeWidth="3"/>
            <rect x="40" y="20" width="70" height="40" rx="4" fill="#B45309" stroke="#F59E0B" strokeWidth="1.5"/>
            <rect x="0" y="32" width="40" height="16" rx="3" fill="#E2E8F0"/>
            <rect x="120" y="32" width="60" height="16" rx="3" fill="#E2E8F0"/>
            <circle cx="185" cy="40" r="14" fill="#EF4444" stroke="#F87171" strokeWidth="2"/>
            <path d="M 125 30 L 130 50 L 135 30 L 140 50 L 145 30 L 150 50 L 155 30" stroke="#94A3B8" strokeWidth="2.5" fill="none"/>
          </g>
          <rect x="70" y="195" width="160" height="26" rx="13" fill="#EF4444" fillOpacity="0.15" stroke="#EF4444" strokeWidth="1"/>
          <text x="150" y="213" fill="#F87171" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">12V HIGH IMPACT SOLENOID</text>
        </svg>
      );

    // 9. BATTERIES & POWER
    case "battery-lipo-3s":
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#0B0F19"/>
          <g transform="translate(60, 50)">
            <rect x="20" y="10" width="140" height="70" rx="10" fill="#1D4ED8" stroke="#3B82F6" strokeWidth="3"/>
            <path d="M 160 30 Q 190 25 210 40" stroke="#EF4444" strokeWidth="5" fill="none"/>
            <path d="M 160 50 Q 190 55 210 45" stroke="#0F172A" strokeWidth="5" fill="none"/>
            <rect x="205" y="32" width="22" height="20" rx="4" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2"/>
            <path d="M 20 50 Q -5 45 -15 35" stroke="#E2E8F0" strokeWidth="3" fill="none"/>
            <rect x="-25" y="25" width="14" height="20" rx="2" fill="#E2E8F0"/>
            <text x="90" y="42" fill="#FFFFFF" fontSize="12" fontFamily="'Outfit', sans-serif" fontWeight="bold" textAnchor="middle">CREOTEX 3S</text>
            <text x="90" y="60" fill="#93C5FD" fontSize="10" fontFamily="'JetBrains Mono'" textAnchor="middle">2200mAh 60C 11.1V</text>
          </g>
          <rect x="70" y="195" width="160" height="26" rx="13" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="1"/>
          <text x="150" y="213" fill="#60A5FA" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">3S 2200MAH 60C LIPO</text>
        </svg>
      );

    // DEFAULT FALLBACK
    default:
      return (
        <svg className={className} viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="240" rx="16" fill="#1E293B"/>
          <circle cx="150" cy="110" r="40" fill="#334155" stroke="#00F0FF" strokeWidth="2"/>
          <path d="M 135 110 L 165 110 M 150 95 L 150 125" stroke="#00F0FF" strokeWidth="3" strokeLinecap="round"/>
          <rect x="75" y="195" width="150" height="26" rx="13" fill="#00F0FF" fillOpacity="0.15" stroke="#00F0FF" strokeWidth="1"/>
          <text x="150" y="213" fill="#00F0FF" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle">CREOTEX COMPONENT</text>
        </svg>
      );
  }
};
