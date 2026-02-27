/* src/components/pages/QRTopup.tsx */
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// นำเข้า saveTransaction เพิ่มเติม
import { updateWalletBalance, saveTransaction, type Transaction } from '@/lib/walletUtils';
import { MOCK_USERS } from '@/lib/mockData';

export default function QRTopup() {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  const quickAmounts = [20, 50, 100, 200, 500, 1000];

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const user = MOCK_USERS.find(u => u.name === savedName);
    
    if (user) {
      setUserPhone(user.phone);
      const localKey = `balance_${user.phone}`;
      const savedBalance = localStorage.getItem(localKey);
      
      if (savedBalance) {
        setCurrentBalance(parseFloat(savedBalance));
      } else {
        setCurrentBalance(user.balance ?? 0);
        localStorage.setItem(localKey, (user.balance ?? 0).toString());
      }
    }
  }, []);

  // 2. ฟังก์ชันยืนยันการเติมเงินที่เพิ่มการบันทึกประวัติ
  const handleConfirm = () => {
    if (amount <= 0 || !userPhone) {
      alert("กรุณาระบุจำนวนเงิน");
      return;
    }

    // อัปเดตยอดเงินลง LocalStorage
    const result = updateWalletBalance(amount, userPhone);

    if (result !== null) {
      // ✅ บันทึกข้อมูลลงในประวัติการทำรายการ (History)
      saveTransaction(userPhone, {
        title: "PromptPay Top-up",
        amount: amount, // ค่าเป็นบวกเพราะเป็นการเติมเงิน
        type: 'topup'
      });

      alert(`เติมเงินสำเร็จ ฿${amount.toFixed(2)}!`);
      router.push('/wallethome'); 
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Header Bar */}
      <div className="flex items-center px-6 py-5 bg-white sticky top-0 z-20">
        <Link href="/wallethome">
          <ChevronLeft className="text-gray-400 cursor-pointer" size={24} />
        </Link>
        <h1 className="text-lg font-black text-[#000000] flex-1 text-center mr-6 uppercase tracking-tight font-sans">PromptPay Top-up</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-8">
        {/* บัตรแสดงยอดเงินปัจจุบัน */}
        <div className="bg-green-50/50 rounded-2xl p-5 flex justify-between items-center border border-green-100 shadow-sm">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Current Balance</p>
            <div className="flex items-center gap-2 text-[#000000]">
              <span className="text-xl font-bold">฿</span>
              <span className="text-2xl font-black tracking-tight font-sans">
                {(currentBalance || 0).toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-[#035433]/10 rounded-xl flex items-center justify-center text-[#035433]">
            <Wallet size={24} />
          </div>
        </div>

        {/* ส่วนป้อนจำนวนเงิน */}
        <div className="text-center space-y-4 pt-4">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Enter Top-up Amount</p>
          <div className="flex items-center justify-center gap-3">
            <span className={`text-4xl font-black ${amount > 0 ? 'text-[#035433]' : 'text-gray-200'}`}>฿</span>
            <input
              type="number"
              value={amount === 0 ? "" : amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") { setAmount(0); return; }
                const numValue = parseFloat(value);
                if (numValue < 0 || numValue > 10000) return;
                if (value.includes(".") && value.split(".")[1].length > 2) return;
                setAmount(numValue);
              }}
              placeholder="0.00"
              className={`text-6xl font-black tracking-tighter w-full max-w-[250px] text-center outline-none bg-transparent font-sans ${
                amount > 0 ? 'text-[#035433]' : 'text-gray-200'
              }`}
            />
          </div>
          <div className={`w-32 h-1.5 mx-auto rounded-full transition-all duration-300 ${
            amount > 0 ? 'bg-[#035433] opacity-100' : 'bg-gray-100 opacity-40'
          }`}></div>
        </div>

        {/* Quick Amount Grid */}
        <div className="grid grid-cols-3 gap-3">
          {quickAmounts.map((val) => (
            <button 
              key={val}
              className={`py-4 rounded-2xl font-black text-xs border transition-all active:scale-95 font-sans ${
                amount === val 
                ? 'bg-[#035433] border-[#035433] text-white shadow-lg shadow-green-900/20' 
                : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setAmount(val)}
            >
              ฿ {val}
            </button>
          ))}
        </div>

        {/* ปุ่มกดยืนยัน */}
        <div className="pt-6 space-y-6">
          <div className="flex items-center justify-center gap-2 opacity-40">
             <div className="w-6 h-6 bg-slate-700 rounded-md flex items-center justify-center text-white font-black text-[8px] font-sans">QR</div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] font-sans">Secured by PromptPay</p>
          </div>
          
          <button 
            onClick={handleConfirm}
            disabled={amount <= 0}
            className={`w-full py-5 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest font-sans ${
              amount > 0 ? 'bg-[#035433] text-white shadow-green-900/20' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            Confirm Top-up
          </button>
          
          <p className="text-[9px] font-bold text-gray-400 text-center px-6 leading-relaxed uppercase tracking-tight font-sans">
            The balance will be updated instantly after the transaction is verified.
          </p>
        </div>
      </div>
    </div>
  );
}