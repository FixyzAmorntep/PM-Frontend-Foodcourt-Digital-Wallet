/* src/lib/mockData.ts */
export const MOCK_USERS = [
  {
    phone: "0970548670",
    password: "password123",
    name: "Fluke Amorntep",
    role: "customer",
    studentId: "6610451231",
    balance: 150.00
  },
  {
    phone: "0811111111",
    password: "merchant123",
    name: "Canteen Stall 5",
    role: "merchant",
    shopName: "Green Noodle Shop",
    balance: 5500.00
  },
  {
    phone: "0800000000",
    password: "admin123",
    name: "KU Food Court Admin",
    role: "admin"
  },
  {
    phone: "0822222222",
    password: "password123",
    name: "Jax Tomson",
    role: "customer",
    studentId: "6610451234",
    balance: 3200.00
  },
  {
    phone: "0833333333",
    password: "password123",
    name: "Sophie Lee",
    role: "customer",
    studentId: "6610451235",
    balance: 850.00
  }
];

// Key สำหรับเก็บข้อมูลใน LocalStorage
export const STORAGE_KEYS = {
  BALANCE: 'ku_wallet_balance',
  USER_NAME: 'userName',
  USER_ROLE: 'userRole'
};