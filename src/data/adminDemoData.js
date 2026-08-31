/**
 * Initial Demo Data for Super Admin Panel
 */

export const INITIAL_ORDERS = [
  {
    id: "ORD-9482",
    customer: {
      name: "Aarav Sharma",
      email: "aarav.robo@iitb.ac.in",
      phone: "+91 98765 43210",
      address: "Hostel 14, IIT Bombay, Powai",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400076"
    },
    items: [
      { id: "mot-001", name: "High Torque N20 Micro Metal Gear Motor (6V 600RPM)", price: 249, quantity: 4, sku: "CTX-MOT-N20-600" },
      { id: "drv-001", name: "Cytron MDD10A 10A Dual Channel DC Motor Driver", price: 1699, quantity: 1, sku: "CTX-DRV-CYT10A" },
      { id: "fast-001", name: "M3 Stainless Steel Allen Socket Cap Screws Kit (300 Pcs)", price: 499, quantity: 1, sku: "CTX-FST-M3-300" }
    ],
    subtotal: 3194,
    discount: 319,
    shipping: 0,
    tax: 517.5,
    totalAmount: 3392.5,
    couponApplied: "ROBO10",
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    date: "2026-08-24 14:20",
    trackingNumber: "BLUEDART-88219401"
  },
  {
    id: "ORD-9481",
    customer: {
      name: "Priya Sundaram",
      email: "priya.maker@gmail.com",
      phone: "+91 98451 22910",
      address: "Flat 402, Green Glen Layout, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103"
    },
    items: [
      { id: "fil-001", name: "Hyper Speed PLA+ 1.75mm Carbon Grey (1kg)", price: 1199, quantity: 2, sku: "CTX-FIL-PLA-GRY" },
      { id: "soc-001", name: "100mm Heavy-Duty Aluminium Mecanum Wheel Set (4-Pack)", price: 3499, quantity: 1, sku: "CTX-SOC-MEC-100" }
    ],
    subtotal: 5897,
    discount: 884.55,
    shipping: 0,
    tax: 902.24,
    totalAmount: 5914.69,
    couponApplied: "MAKER50",
    paymentMethod: "Credit Card (Visa)",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    date: "2026-08-23 18:45",
    trackingNumber: "DELHIVERY-99214432"
  },
  {
    id: "ORD-9480",
    customer: {
      name: "Rohan Patel",
      email: "rohan.patel@bvmengineering.ac.in",
      phone: "+91 97123 55432",
      address: "Robotics Club, VV Nagar",
      city: "Anand",
      state: "Gujarat",
      pincode: "388120"
    },
    items: [
      { id: "lfr-001", name: "Creotex High-Speed Pro Line Follower Robot Kit v4.2", price: 3899, quantity: 1, sku: "CTX-LFR-PRO-V4" },
      { id: "rac-001", name: "Creotex Phantom Carbon Fiber 4WD Robo Race Chassis", price: 2299, quantity: 1, sku: "CTX-RAC-CF-4WD" }
    ],
    subtotal: 6198,
    discount: 250,
    shipping: 0,
    tax: 1070.64,
    totalAmount: 7018.64,
    couponApplied: "CREOTEX2026",
    paymentMethod: "UPI (PhonePe)",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    date: "2026-08-22 11:10",
    trackingNumber: "ECOMEXP-1092384"
  },
  {
    id: "ORD-9479",
    customer: {
      name: "Ananya Deshmukh",
      email: "ananya.d@techlab.org",
      phone: "+91 98220 99881",
      address: "12 Deccan Gymkhana, Prabhat Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411004"
    },
    items: [
      { id: "pow-001", name: "Creotex 3S 11.1V 2200mAh 60C High Discharge LiPo Battery", price: 1499, quantity: 2, sku: "CTX-BAT-3S-2200" },
      { id: "brg-001", name: "608ZZ High Speed ABEC-9 Chrome Steel Bearings (10-Pack)", price: 299, quantity: 3, sku: "CTX-BRG-608ZZ-10" }
    ],
    subtotal: 3895,
    discount: 0,
    shipping: 0,
    tax: 701.1,
    totalAmount: 4596.1,
    couponApplied: null,
    paymentMethod: "Net Banking (HDFC)",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    date: "2026-08-21 09:30",
    trackingNumber: "DTDC-PUN-33921"
  },
  {
    id: "ORD-9478",
    customer: {
      name: "Dr. K. Senthil",
      email: "senthil.k@mitindia.edu",
      phone: "+91 94441 33445",
      address: "Aerospace Dept, MIT Chromepet",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600044"
    },
    items: [
      { id: "mot-003", name: "Emax RS2205 2300KV Brushless DC Motor (CW & CCW Pair)", price: 1399, quantity: 2, sku: "CTX-MOT-BLDC-2205" },
      { id: "drv-003", name: "TMC2209 Ultra-Silent Stepper Motor Driver Module (V1.3)", price: 349, quantity: 4, sku: "CTX-DRV-TMC2209" }
    ],
    subtotal: 4194,
    discount: 419.4,
    shipping: 0,
    tax: 679.43,
    totalAmount: 4454.03,
    couponApplied: "ROBO10",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    date: "2026-08-20 16:50",
    trackingNumber: null
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "CUST-101",
    name: "Aarav Sharma",
    email: "aarav.robo@iitb.ac.in",
    phone: "+91 98765 43210",
    tier: "Maker Pro",
    totalOrders: 6,
    totalSpent: 18450,
    status: "Active",
    joinedDate: "2025-09-15",
    city: "Mumbai"
  },
  {
    id: "CUST-102",
    name: "Priya Sundaram",
    email: "priya.maker@gmail.com",
    phone: "+91 98451 22910",
    tier: "Enterprise Lab",
    totalOrders: 12,
    totalSpent: 54800,
    status: "Active",
    joinedDate: "2025-06-20",
    city: "Bengaluru"
  },
  {
    id: "CUST-103",
    name: "Rohan Patel",
    email: "rohan.patel@bvmengineering.ac.in",
    phone: "+91 97123 55432",
    tier: "Student Maker",
    totalOrders: 3,
    totalSpent: 11200,
    status: "Active",
    joinedDate: "2026-01-10",
    city: "Anand"
  },
  {
    id: "CUST-104",
    name: "Ananya Deshmukh",
    email: "ananya.d@techlab.org",
    phone: "+91 98220 99881",
    tier: "Maker Pro",
    totalOrders: 8,
    totalSpent: 29300,
    status: "Active",
    joinedDate: "2025-11-04",
    city: "Pune"
  },
  {
    id: "CUST-105",
    name: "Dr. K. Senthil",
    email: "senthil.k@mitindia.edu",
    phone: "+91 94441 33445",
    tier: "Enterprise Lab",
    totalOrders: 15,
    totalSpent: 78900,
    status: "Active",
    joinedDate: "2025-04-18",
    city: "Chennai"
  },
  {
    id: "CUST-106",
    name: "Tanmay Bhasin",
    email: "tanmay.b@delhirobo.org",
    phone: "+91 98112 00412",
    tier: "Hobbyist",
    totalOrders: 2,
    totalSpent: 4200,
    status: "Active",
    joinedDate: "2026-02-14",
    city: "Delhi"
  }
];

export const INITIAL_DATASHEETS = [
  {
    id: "DS-001",
    title: "Cytron MDD10A 10A Dual Channel Driver User Manual & Schematic",
    category: "Motor Drivers",
    format: "PDF",
    size: "2.4 MB",
    downloads: 1420,
    sku: "CTX-DRV-CYT10A",
    lastUpdated: "2026-01-15"
  },
  {
    id: "DS-002",
    title: "N20 Micro Metal Gear Motor CAD Model 3D STEP & Torque Curves",
    category: "Motors",
    format: "STEP / PDF",
    size: "4.8 MB",
    downloads: 2890,
    sku: "CTX-MOT-N20-600",
    lastUpdated: "2026-02-01"
  },
  {
    id: "DS-003",
    title: "Creotex High-Speed Pro Line Follower PID Tuning Guide & Firmware",
    category: "Kits & Guides",
    format: "ZIP / C++",
    size: "1.2 MB",
    downloads: 980,
    sku: "CTX-LFR-PRO-V4",
    lastUpdated: "2026-02-18"
  },
  {
    id: "DS-004",
    title: "MPU-6050 6-DOF IMU Sensor Register Map & Arduino Calibration",
    category: "Sensors",
    format: "PDF / INO",
    size: "1.6 MB",
    downloads: 3410,
    sku: "CTX-SEN-MPU6050",
    lastUpdated: "2025-12-10"
  },
  {
    id: "DS-005",
    title: "Phantom Carbon Fiber 4WD Chassis Assembly Manual & CAD Blueprints",
    category: "Chassis & Frame",
    format: "PDF / DXF",
    size: "8.5 MB",
    downloads: 1150,
    sku: "CTX-RAC-CF-4WD",
    lastUpdated: "2026-01-28"
  }
];

export const INITIAL_SETTINGS = {
  storeName: "CreotexShop Robotics & Maker Superstore",
  storeTagline: "High-Performance Robotics Kits, Motors, Drivers & Prototyping Gear",
  contactEmail: "admin@creotex.in",
  supportPhone: "+91 80 4912 8800",
  gstRate: 18,
  freeShippingThreshold: 999,
  standardShippingCost: 79,
  currencySymbol: "₹",
  announcementBanner: "⚡ Free Express Shipping on all Robotics Orders over ₹999 across India!",
  bannerActive: true,
  maintenanceMode: false
};

export const INITIAL_USERS = [
  {
    id: "usr-admin-01",
    name: "Root Administrator",
    email: "admin@creotex.in",
    password: "admin123",
    role: "super_admin",
    tier: "Super Admin",
    phone: "+91 80 4912 8800",
    city: "Bengaluru",
    status: "Active",
    joinedDate: "2024-01-01",
    lastLogin: "2026-08-29 14:15"
  },
  {
    id: "usr-admin-02",
    name: "Vikram Sarabhai Lab Ops",
    email: "ops@creotex.in",
    password: "admin456",
    role: "super_admin",
    tier: "Super Admin",
    phone: "+91 80 4912 8801",
    city: "Hyderabad",
    status: "Active",
    joinedDate: "2024-06-15",
    lastLogin: "2026-08-28 11:30"
  },
  {
    id: "usr-maker-01",
    name: "Aarav Sharma",
    email: "aarav.robo@iitb.ac.in",
    password: "maker123",
    role: "customer",
    tier: "Maker Pro",
    phone: "+91 98765 43210",
    city: "Mumbai",
    status: "Active",
    joinedDate: "2025-09-15",
    lastLogin: "2026-08-29 10:20"
  },
  {
    id: "usr-maker-02",
    name: "Priya Sundaram",
    email: "priya.maker@gmail.com",
    password: "maker123",
    role: "customer",
    tier: "Enterprise Lab",
    phone: "+91 98451 22910",
    city: "Bengaluru",
    status: "Active",
    joinedDate: "2025-06-20",
    lastLogin: "2026-08-27 18:45"
  },
  {
    id: "usr-maker-03",
    name: "Rohan Patel",
    email: "rohan.patel@bvmengineering.ac.in",
    password: "rohan#2026",
    role: "customer",
    tier: "Student Maker",
    phone: "+91 97123 55432",
    city: "Anand",
    status: "Active",
    joinedDate: "2026-01-10",
    lastLogin: "2026-08-25 09:12"
  },
  {
    id: "usr-maker-04",
    name: "Ananya Deshmukh",
    email: "ananya.d@techlab.org",
    password: "ananya@robo",
    role: "customer",
    tier: "Maker Pro",
    phone: "+91 98220 99881",
    city: "Pune",
    status: "Active",
    joinedDate: "2025-11-04",
    lastLogin: "2026-08-26 16:30"
  },
  {
    id: "usr-maker-05",
    name: "Dr. K. Senthil",
    email: "senthil.k@mitindia.edu",
    password: "mit#aero2026",
    role: "customer",
    tier: "Enterprise Lab",
    phone: "+91 94441 33445",
    city: "Chennai",
    status: "Active",
    joinedDate: "2025-04-18",
    lastLogin: "2026-08-28 20:05"
  },
  {
    id: "usr-maker-06",
    name: "Tanmay Bhasin",
    email: "tanmay.b@delhirobo.org",
    password: "drone#maker9",
    role: "customer",
    tier: "Hobbyist",
    phone: "+91 98112 00412",
    city: "Delhi",
    status: "Suspended",
    joinedDate: "2026-02-14",
    lastLogin: "2026-07-30 14:00"
  }
];


