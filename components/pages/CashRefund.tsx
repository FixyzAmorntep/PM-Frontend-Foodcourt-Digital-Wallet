/* src/components/pages/CashRefund.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, HelpCircle, QrCode, Banknote, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
// นำเข้า helper สำหรับจัดการเงินและประวัติ
import { updateWalletBalance, saveTransaction } from '@/lib/walletUtils'; 
import { MOCK_USERS } from '@/lib/mockData';

export default function CashRefund() {
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  
  // State สำหรับควบคุมการแสดงผลของรายการ
  const [hasTopup, setHasTopup] = useState(true);
  const [hasRefund, setHasRefund] = useState(true);

  const topupAmount = 100.00;
  const refundAmount = 45.00;

  // ฟังก์ชันดึงยอดเงินล่าสุดมาแสดง
  const refreshUI = (phone: string) => {
    const latestBalance = localStorage.getItem(`balance_${phone}`);
    if (latestBalance) {
      setCurrentBalance(parseFloat(latestBalance));
    }
  };

  useEffect(() => {
    const savedPhone = localStorage.getItem('userPhone');
    const savedName = localStorage.getItem('userName');
    const user = MOCK_USERS.find(u => u.name === savedName || u.phone === savedPhone);
    
    if (user && savedPhone) {
      setUserPhone(savedPhone);
      refreshUI(savedPhone);
    }
  }, []);

  const handleTopup = () => {
    if (!userPhone) return;
    // 1. อัปเดตเงินในระบบ
    const result = updateWalletBalance(topupAmount, userPhone);
    
    if (result !== null) {
      // 2. บันทึกประวัติ
      saveTransaction(userPhone, { title: "Cash Top-up", amount: topupAmount, type: 'topup' });
      // 3. ปิดรายการ (ทำให้หายไปจากหน้าจอ)
      setHasTopup(false);
      // 4. อัปเดตยอดเงินที่โชว์ด้านบนทันทีโดยไม่รีโหลดหน้า
      setCurrentBalance(result);
    }
  };

  const handleRefund = () => {
    if (!userPhone || currentBalance < refundAmount) return;
    // 1. หักเงินในระบบ
    const result = updateWalletBalance(-refundAmount, userPhone);
    
    if (result !== null) {
      // 2. บันทึกประวัติ
      saveTransaction(userPhone, { title: "Cash Refund", amount: -refundAmount, type: 'payment' });
      // 3. ปิดรายการ
      setHasRefund(false);
      // 4. อัปเดตยอดเงิน
      setCurrentBalance(result);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FBFA] font-sans">
      {/* 1. Header */}
      <div className="flex justify-between items-center px-6 py-5 bg-white border-b border-gray-50 sticky top-0 z-20">
        <Link href="/wallethome">
          <ChevronLeft className="text-gray-400" size={24} />
        </Link>
        <h1 className="text-lg font-bold text-[#1a1c1e] text-center flex-1">Cash & Refund</h1>
        <HelpCircle className="text-gray-400" size={24} />
      </div>

      <div className="flex-1 px-6 py-8 space-y-8 overflow-y-auto">
        
        {/* 2. QR Section */}
        <div className="text-center space-y-4">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-full aspect-square bg-[#3D665D] rounded-3xl p-10 flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="bg-white p-4 rounded-2xl shadow-2xl">
                <QrCode size={120} className="text-[#3D665D]" />
              </div>
            </div>
            <div className="mt-6 space-y-1 text-center">
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Current Balance</p>
              <p className="text-2xl font-black text-[#035433]">฿{currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        {/* 3. รายการค้าง */}
        <div className="space-y-6">
          
          {/* --- รายการเติมเงิน (Top-up) --- */}
          {hasTopup && (
            <div className="bg-white rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#035433] mb-4">
                <Banknote size={24} />
              </div>
              <div className="space-y-1 mb-6">
                <h3 className="text-[10px] font-black text-[#1A1C1E] uppercase tracking-tight">Pending Cash Top-up</h3>
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider italic">From Counter: 01</p>
                <div className="pt-3">
                   <p className="text-xl font-black text-[#035433] tracking-tighter">฿{topupAmount.toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button 
                  onClick={() => setHasTopup(false)}
                  className="py-2 rounded-xl text-[12px] font-black uppercase tracking-widest border border-gray-100 text-gray-400 active:scale-95 transition-all"
                >
                  Reject
                </button>
                <button 
                  onClick={handleTopup}
                  className="py-2 rounded-xl text-[12px] font-black uppercase tracking-widest bg-[#035433] text-white shadow-lg active:scale-95 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}

          {/* --- รายการคืนเงิน (Refund) --- */}
          {hasRefund && (
            <div className="bg-white rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                <RefreshCcw size={24} />
              </div>
              <div className="space-y-1 mb-6">
                <h3 className="text-[10px] font-black text-[#1A1C1E] uppercase tracking-tight">Pending Cash Refund</h3>
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider italic">From Shop 04: KU Noodles</p>
                <div className="pt-3">
                   <p className="text-xl font-black text-red-500 tracking-tighter">฿{refundAmount.toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button 
                  onClick={() => setHasRefund(false)}
                  className="py-2 rounded-xl text-[12px] font-black uppercase tracking-widest border border-gray-100 text-gray-400 active:scale-95 transition-all"
                >
                  Reject
                </button>
                <button 
                  onClick={handleRefund}
                  className="py-2 rounded-xl text-[12px] font-black uppercase tracking-widest bg-red-500 text-white shadow-lg active:scale-95 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}