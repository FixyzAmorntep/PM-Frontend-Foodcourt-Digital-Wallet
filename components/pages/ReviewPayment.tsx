/* src/components/pages/ReviewPayment.tsx */
'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ShieldCheck, Wallet, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// ✅ 1. นำเข้า updateWalletBalance และ saveTransaction ให้ครบ
import { updateWalletBalance, saveTransaction, type Transaction } from '@/lib/walletUtils';
import { MOCK_USERS } from '@/lib/mockData';

export default function ReviewPayment() {
  const router = useRouter();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  const data = {
    merchant: "KU Noodle Stall",
    location: "Kasetsart University Food Court",
    amount: 55.00
  };

  useEffect(() => {
    const savedPhone = localStorage.getItem('userPhone');
    const savedName = localStorage.getItem('userName');
    const user = MOCK_USERS.find(u => u.name === savedName || u.phone === savedPhone);
    
    if (user && savedPhone) {
      setUserPhone(savedPhone);
      const localKey = `balance_${savedPhone}`;
      const savedBalance = localStorage.getItem(localKey);
      setCurrentBalance(savedBalance ? parseFloat(savedBalance) : user.balance ?? 0);
    }
  }, []);

  // 2. ฟังก์ชันยืนยันที่ทำงานครบถ้วนทั้ง หักเงิน และ บันทึกประวัติ
  const handleConfirm = () => {
    if (!userPhone) return;

    // ✅ หักเงินผ่าน Helper (ใส่ค่าติดลบสำหรับรายจ่าย)
    const result = updateWalletBalance(-data.amount, userPhone);

    if (result !== null) {
      // ✅ บันทึกประวัติลงเครื่อง
      saveTransaction(userPhone, {
        title: data.merchant,
        amount: -data.amount,
        type: 'payment'
      });
      
      router.push('/paymentsuccess');
    } else {
      alert("ยอดเงินไม่เพียงพอ");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFB] h-full font-sans">
      <div className="flex justify-between items-center px-6 py-6 bg-white border-b border-gray-100 sticky top-0 z-20">
        <Link href="/scanpay">
          <ChevronLeft className="text-gray-400 active:scale-90 transition-transform" size={24} />
        </Link>
        <h1 className="text-lg font-black text-[#035433] uppercase tracking-tight font-sans">Payment Review</h1>
        <div className="w-6" />
      </div>

      <div className="p-6 flex-1 flex flex-col font-sans">
        <div className="mb-10">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-2">
            <span>Confirmation</span>
            <span>Step 2 of 3</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-[#00E676] rounded-full shadow-[0_0_10px_rgba(0,230,118,0.5)]"></div>
          </div>
        </div>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#035433]">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{data.merchant}</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{data.location}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Method</span>
            <div className="flex items-center gap-2 text-[#035433] font-black text-[10px] bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
              <Wallet size={12} /> KU Wallet
            </div>
          </div>
          <div className="h-px bg-gray-50 w-full mb-6" />
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
            <div className="flex items-baseline gap-1 text-[#035433]">
              <span className="text-2xl font-bold">฿</span>
              <span className="text-4xl font-black tracking-tighter">
                {data.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-dashed border-gray-100 flex justify-between items-center">
            <span className="text-[9px] font-bold text-gray-300 uppercase">Available Balance</span>
            <span className="text-[10px] font-black text-gray-400 italic">
              ฿{currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="mt-auto space-y-4 pt-8">
          <button 
            onClick={handleConfirm}
            className="w-full bg-[#00E676] text-[#023b24] py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-100 active:scale-[0.97] transition-all uppercase tracking-[0.15em] font-sans"
          >
            Confirm Payment
          </button>
          <Link href="/scanpay" className="block text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-600 transition-colors font-sans">
            Cancel Transaction
          </Link>
          <div className="flex items-center justify-center gap-2 text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em] pt-4 font-sans">
            <ShieldCheck size={14} /> Secure Encrypted Transaction
          </div>
        </div>
      </div>
    </div>
  );
}