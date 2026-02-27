/* src/lib/walletUtils.ts */

// ตรวจสอบว่ามีคำว่า export นำหน้าฟังก์ชันเหล่านี้
export const updateWalletBalance = (amount: number, phone: string): number | null => {
  if (typeof window === 'undefined' || !phone) return null;
  const currentBalance = parseFloat(localStorage.getItem(`balance_${phone}`) || '0');
  const newBalance = currentBalance + amount;
  if (newBalance < 0) return null; 
  localStorage.setItem(`balance_${phone}`, newBalance.toString());
  return newBalance;
};

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  time: string;
  type: 'topup' | 'payment';
}

// จุดสำคัญ: ต้องมีคำว่า export และชื่อต้องสะกดว่า saveTransaction เป๊ะๆ
export const saveTransaction = (phone: string, transaction: Omit<Transaction, 'id' | 'time'>) => {
  if (typeof window === 'undefined' || !phone) return;

  const historyKey = `history_${phone}`;
  // ดึงข้อมูลเก่ามา ถ้าไม่มีให้เป็นอาเรย์ว่าง
  const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');

  const newRecord: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    time: new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    })
  };

  // บันทึกกลับเข้าไป โดยเอาของใหม่ไว้บนสุด
  const updatedHistory = [newRecord, ...existingHistory];
  localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
};