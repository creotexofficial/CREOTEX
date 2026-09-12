export const seedRobotBuilderPresets = {
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
      motors: "mot-003",
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
      motors: "mot-001",
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

export const seedRobotBuilderSlots = [
  {
    key: "chassis",
    name: "1. Main Chassis Frame",
    description: "Core structural frame supporting all electronic and mechanical modules.",
    options: [
      { id: "rac-001", name: "AeroForce Carbon Fiber Race Chassis (3mm)", price: 1299, sku: "CTX-RAC-CHS-CF3" },
      { id: "soc-001", name: "StrikePro 3-Wheel Omni Soccer Chassis", price: 2499, sku: "CTX-SOC-CHS-3OMN" },
      { id: "lfr-001", name: "Phantom PRO CNC Aluminum LFR Chassis", price: 3499, sku: "CTX-KIT-LFR-PRO" },
      { id: "lfr-003", name: "Creotex Dual-Layer Acrylic Starter Chassis", price: 1499, sku: "CTX-KIT-LFR-STR" }
    ]
  },
  {
    key: "motors",
    name: "2. Motors & Drive Train",
    description: "High-torque and high-RPM propulsion actuators tailored for competition dynamics.",
    options: [
      { id: "mot-001", name: "12V PG-36 Planetary DC Motor 600RPM", price: 1199, sku: "CTX-MOT-PG36-600" },
      { id: "mot-002", name: "NEMA 17 Stepper Motor 1.8°", price: 649, sku: "CTX-MOT-NEMA17-48" },
      { id: "mot-003", name: "Micro N20 Metal Gearmotor 1000RPM + Encoder", price: 449, sku: "CTX-MOT-N20-1000E" },
      { id: "mot-005", name: "A2212 1400KV Brushless Outrunner BLDC Motor", price: 499, sku: "CTX-MOT-BLDC-2212" },
      { id: "mot-004", name: "MG996R Metal Gear Digital Servo 13KG", price: 389, sku: "CTX-MOT-MG996R" }
    ]
  },
  {
    key: "wheels",
    name: "3. Wheels & Traction",
    description: "Specialized tires and omni/mecanum wheels for high grip and omnidirectional mobility.",
    options: [
      { id: "rac-002", name: "Sticky Silicone Race Wheels 65mm (Pair)", price: 699, sku: "CTX-RAC-WHL-65S" },
      { id: "soc-002", name: "60mm CNC Aluminum Mecanum Wheels (Set of 4)", price: 2299, sku: "CTX-SOC-WHL-60MEC" },
      { id: "soc-003", name: "100mm Dual-Plate Nylon Omni Wheels (Pair)", price: 1199, sku: "CTX-SOC-WHL-100OM" },
      { id: "rac-003", name: "Monster 80mm High-Traction Rubber Wheels (Pair)", price: 549, sku: "CTX-RAC-WHL-80R" }
    ]
  },
  {
    key: "driver",
    name: "4. Motor Driver & ESC",
    description: "High current speed controllers and solid-state MOSFET drivers.",
    options: [
      { id: "drv-001", name: "Cytron MDD10A 10A Dual DC Motor Driver", price: 1899, sku: "CTX-DRV-CYT-MDD10A" },
      { id: "drv-002", name: "TB6612FNG Dual MOSFET Driver Module", price: 189, sku: "CTX-DRV-TB6612" },
      { id: "drv-004", name: "40A Dual-Direction Bidirectional Brushless ESC", price: 899, sku: "CTX-DRV-ESC40A-BI" },
      { id: "drv-003", name: "TMC2209 Ultra-Silent Stepper Driver (Pack of 4)", price: 999, sku: "CTX-DRV-TMC2209-4X" }
    ]
  },
  {
    key: "power",
    name: "5. Power & Battery Pack",
    description: "High-discharge LiPo battery source supplying instant peak burst currents.",
    options: [
      { id: "pwr-001", name: "Creotex 11.1V 3S 2200mAh 60C LiPo Pack (XT60)", price: 1699, sku: "CTX-PWR-LPO-3S22" }
    ]
  },
  {
    key: "addon",
    name: "6. Competition Weapon / Sensor Addon",
    description: "Application-specific competition hardware like kickers, sensor bars, and hub extensions.",
    options: [
      { id: "soc-004", name: "12V High-Impact Solenoid Ball Kicker", price: 949, sku: "CTX-SOC-KCK-12V" },
      { id: "lfr-002", name: "QTR-8RC 8-Channel Reflective IR Sensor Array", price: 499, sku: "CTX-SEN-QTR-8RC" },
      { id: "rac-004", name: "Brass Extended Wheel Hex Hubs (30mm - 4 Pcs)", price: 349, sku: "CTX-RAC-HUB-30B" },
      { id: "sen-001", name: "MPU-6050 6-Axis Gyro & Accelerometer IMU", price: 159, sku: "CTX-SEN-MPU6050" }
    ]
  }
];

export const seedRobotBuilderSettings = {
  builderTitle: "Custom Competition Combat & Race Robot Configurator",
  enableDiscounts: true,
  bundleDiscountPercent: 10
};
