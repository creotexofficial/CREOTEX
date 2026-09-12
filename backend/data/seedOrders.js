export const seedOrders = [
  {
    orderId: "ORD-9482",
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
      { id: "mot-001", name: "12V High-Torque All-Metal Planetary Geared DC Motor 600RPM (PG-36 Series)", price: 1199, quantity: 2, sku: "CTX-MOT-PG36-600" },
      { id: "drv-001", name: "Cytron MDD10A 10Amp 5V-30V Dual Channel DC Motor Driver", price: 1899, quantity: 1, sku: "CTX-DRV-CYT-MDD10A" },
      { id: "fast-001", name: "M3 Stainless Steel Allen Socket Cap Screws Kit (300 Pcs)", price: 499, quantity: 1, sku: "CTX-FST-M3-300" }
    ],
    subtotal: 4796,
    discount: 479.6,
    shipping: 0,
    tax: 776.95,
    totalAmount: 5093.35,
    couponApplied: "ROBO10",
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    trackingNumber: "BLUEDART-88219401"
  },
  {
    orderId: "ORD-9481",
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
      { id: "fil-001", name: "Creotex High-Speed Hyper PLA Filament 1.75mm (1KG Spool) - Cyber Black", price: 899, quantity: 2, sku: "CTX-3DP-PLA-BLK" },
      { id: "soc-002", name: "60mm CNC Aluminum Mecanum Wheels Set of 4 with 6mm Couplers", price: 2299, quantity: 1, sku: "CTX-SOC-WHL-60MEC" }
    ],
    subtotal: 4097,
    discount: 614.55,
    shipping: 0,
    tax: 626.84,
    totalAmount: 4109.29,
    couponApplied: "MAKER50",
    paymentMethod: "Credit Card (Visa)",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    trackingNumber: "DELHIVERY-99214432"
  },
  {
    orderId: "ORD-9480",
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
      { id: "lfr-001", name: "Creotex Phantom PRO High-Speed Line Follower Robot Complete Kit", price: 3499, quantity: 1, sku: "CTX-KIT-LFR-PRO" },
      { id: "rac-001", name: "AeroForce Carbon Fiber Robo Race Chassis (3mm)", price: 1299, quantity: 1, sku: "CTX-RAC-CHS-CF3" }
    ],
    subtotal: 4798,
    discount: 250,
    shipping: 0,
    tax: 818.64,
    totalAmount: 5366.64,
    couponApplied: "CREOTEX2026",
    paymentMethod: "UPI (PhonePe)",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    trackingNumber: "ECOMEXP-1092384"
  }
];

export default seedOrders;
