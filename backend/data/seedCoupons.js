export const seedCoupons = [
  {
    code: "ROBO10",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 500,
    maxDiscount: 500,
    usageLimit: 1000,
    isActive: true,
    description: "10% OFF on all Robotics components for orders above ₹500"
  },
  {
    code: "MAKER50",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 1500,
    maxDiscount: 1000,
    usageLimit: 500,
    isActive: true,
    description: "15% OFF for Maker Pro lab orders above ₹1500"
  },
  {
    code: "CREOTEX2026",
    discountType: "fixed",
    discountValue: 250,
    minOrderValue: 2000,
    maxDiscount: 250,
    usageLimit: 200,
    isActive: true,
    description: "Flat ₹250 instant discount on high performance orders above ₹2000"
  }
];

export default seedCoupons;
