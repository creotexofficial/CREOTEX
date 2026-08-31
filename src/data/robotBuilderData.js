/**
 * Default Data for Custom Competition Robot Builder
 * Presets, Component Slots, Options, and Global Settings
 */

export const DEFAULT_BUILDER_PRESETS = {
  "robo-race": {
    id: "robo-race",
    name: "Hyper-Speed Robo Race Bot",
    subtitle: "High Speed & Grip",
    icon: "🏎️",
    desc: "Engineered for tight cornering, zero-slip high traction, and explosive acceleration.",
    active: true,
    defaults: {
      chassis: "rac-001",
      motors: "mot-001",
      wheels: "rac-002",
      driver: "drv-001",
      power: "pwr-001",
      addon: "rac-004"
    }
  },
  "line-follower": {
    id: "line-follower",
    name: "Championship High-Speed LFR",
    subtitle: "PID Sensor Precision",
    icon: "⚡",
    desc: "Sub-millimeter line detection with high-RPM micro motors and PID responsiveness.",
    active: true,
    defaults: {
      chassis: "lfr-001",
      motors: "mot-001",
      wheels: "rac-002",
      driver: "drv-002",
      power: "pwr-001",
      addon: "lfr-002"
    }
  },
  "soccer-robot": {
    id: "soccer-robot",
    name: "RoboCup 3-Wheel Omni Soccer Striker",
    subtitle: "Holonomic & Kicker",
    icon: "⚽",
    desc: "360-degree omni mobility with high-torque gearboxes and solenoid kicker.",
    active: true,
    defaults: {
      chassis: "soc-001",
      motors: "mot-002",
      wheels: "soc-002",
      driver: "drv-001",
      power: "pwr-001",
      addon: "soc-004"
    }
  },
  "combat-robot": {
    id: "combat-robot",
    name: "Titanium Heavy Antweight Combat Bot",
    subtitle: "Kinetic Spinner & Armor",
    icon: "⚔️",
    desc: "High-RPM brushless kinetic weapon spinner with hardened aluminum chassis and impact resistance.",
    active: true,
    defaults: {
      chassis: "rac-001",
      motors: "mot-005",
      wheels: "rac-003",
      driver: "drv-004",
      power: "pwr-001",
      addon: "sen-001"
    }
  }
};

export const DEFAULT_BUILDER_SLOTS = [
  {
    key: "chassis",
    name: "1. Main Chassis Frame",
    description: "Core structural frame supporting all electronic and mechanical modules.",
    options: [
      { id: "rac-001", name: "AeroForce Carbon Fiber Race Chassis (3mm)", price: 1299, sku: "CTX-RAC-CF-01" },
      { id: "soc-001", name: "StrikePro 3-Wheel Omni Soccer Chassis", price: 2499, sku: "CTX-SOC-OMN-01" },
      { id: "lfr-001", name: "Phantom PRO CNC Aluminum LFR Chassis", price: 3499, sku: "CTX-LFR-CNC-01" },
      { id: "lfr-003", name: "Creotex Dual-Layer Acrylic Starter Chassis", price: 1499, sku: "CTX-LFR-ACR-03" }
    ]
  },
  {
    key: "motors",
    name: "2. Motors & Drive Train",
    description: "High-torque and high-RPM propulsion actuators tailored for competition dynamics.",
    options: [
      { id: "mot-001", name: "12V PG-36 Planetary DC Motor 600RPM", price: 1199, sku: "CTX-MOT-PG36" },
      { id: "mot-002", name: "High Torque 12V 500RPM Metal Gearmotor", price: 799, sku: "CTX-MOT-12V500" },
      { id: "mot-003", name: "Micro N20 Metal Gearmotor 1000RPM + Encoder", price: 449, sku: "CTX-MOT-N20ENC" },
      { id: "mot-005", name: "A2212 1400KV Brushless Outrunner BLDC Motor", price: 499, sku: "CTX-MOT-BLDC2212" },
      { id: "mot-004", name: "MG996R Metal Gear Digital Servo 13KG", price: 389, sku: "CTX-SRV-MG996R" }
    ]
  },
  {
    key: "wheels",
    name: "3. Wheels & Traction",
    description: "Specialized tires and omni/mecanum wheels for high grip and omnidirectional mobility.",
    options: [
      { id: "rac-002", name: "SuperGrip Sticky Silicone Wheels 65mm (Pair)", price: 699, sku: "CTX-WHL-SIL-65" },
      { id: "soc-002", name: "60mm CNC Aluminum Mecanum Wheels (Set of 4)", price: 2299, sku: "CTX-WHL-MEC-60" },
      { id: "rac-003", name: "Monster 80mm High-Traction Rubber Wheels", price: 549, sku: "CTX-WHL-RUB-80" },
      { id: "soc-003", name: "100mm Dual-Plate Nylon Omni Wheels (Pair)", price: 1199, sku: "CTX-WHL-OMN-100" }
    ]
  },
  {
    key: "driver",
    name: "4. Motor Driver / ESC",
    description: "High-current H-bridges and electronic speed controllers with regenerative braking.",
    options: [
      { id: "drv-001", name: "Cytron MDD10A 10A Dual Motor Driver", price: 1899, sku: "CTX-DRV-CYT10A" },
      { id: "drv-002", name: "TB6612FNG Dual MOSFET Driver Module", price: 189, sku: "CTX-DRV-TB6612" },
      { id: "drv-004", name: "40A Dual-Direction Bidirectional ESC", price: 899, sku: "CTX-DRV-ESC40A" }
    ]
  },
  {
    key: "power",
    name: "5. Battery & Power",
    description: "High-discharge lithium-polymer packs ensuring consistent voltage under peak load.",
    options: [
      { id: "pwr-001", name: "Creotex 11.1V 3S 2200mAh 60C LiPo Pack", price: 1699, sku: "CTX-BAT-3S-2200" },
      { id: "pwr-002", name: "Creotex 7.4V 2S 1500mAh 45C LiPo Battery", price: 1099, sku: "CTX-BAT-2S-1500" },
      { id: "pwr-003", name: "12V 3000mAh NiMH High-Capacity Competition Pack", price: 1399, sku: "CTX-BAT-NIMH-3000" }
    ]
  },
  {
    key: "addon",
    name: "6. Competition Weapon / Sensor Addon",
    description: "Mission-critical competition attachments, sensor arrays, kickers, and telemetry.",
    options: [
      { id: "soc-004", name: "12V High-Impact Solenoid Kicker Mechanism", price: 949, sku: "CTX-ADD-KCK-12V" },
      { id: "lfr-002", name: "QTR-8RC 8-Channel Reflective Sensor Array", price: 499, sku: "CTX-ADD-QTR8RC" },
      { id: "rac-004", name: "Brass Extended 30mm Wheel Hex Hubs (4 Pcs)", price: 349, sku: "CTX-ADD-HEX-30" },
      { id: "sen-001", name: "MPU-6050 6-Axis Gyro & Accel IMU", price: 159, sku: "CTX-SEN-MPU6050" }
    ]
  }
];

export const DEFAULT_BUILDER_SETTINGS = {
  enabled: true,
  badge: "Interactive Engineering Tool",
  title: "Custom Competition Robot Builder",
  subtitle: "Configure your championship Line Follower, Robo Race, Combat Bot, or 360° Soccer Robot in real time. 100% component compatibility guaranteed with a custom kit discount!",
  discountPercent: 10,
  perks: [
    "100% Component Compatibility Verified",
    "Includes Screws, Standoffs & Wire Cables",
    "Free Express Delivery + Pre-Tuned Sample Code & Schematics"
  ]
};
