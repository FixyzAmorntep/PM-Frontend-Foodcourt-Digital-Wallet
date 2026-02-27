/* src/components/pages/PaymentSuccess.tsx */
'use client';

import React from 'react';
import { Check, X, Copy, History, Home } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccess() {
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFB] relative overflow-hidden">
      
      {/* 1. Header: ปรับขนาดให้กะทัดรัด */}
      <div className="flex justify-between items-center px-6 py-4 sticky top-0 z-10 bg-white border-b border-gray-50">
        <Link href="/wallethome">
          <div className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </div>
        </Link>
        <h1 className="text-sm font-black text-[#1a1c1e] uppercase tracking-[0.2em]">Receipt</h1>
        <div className="w-10" />
      </div>

      <div className="px-6 pb-8 flex-1 flex flex-col items-center">
        
        {/* 2. Success Badge: ปรับขนาดจาก 24 เหลือ 20 */}
        <div className="my-6 relative">
          <div className="w-20 h-20 bg-[#00E676]/10 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-[#00E676] rounded-full flex items-center justify-center shadow-lg shadow-green-100">
              <Check className="text-white" size={32} strokeWidth={4} />
            </div>
          </div>
        </div>

        {/* 3. Status Text */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-[#035433] leading-tight">Payment Successful</h2>
          <p className="text-[10px] text-gray-400 font-bold tracking-widest mt-1 opacity-70">
            Your transaction was completed
          </p>
        </div>

        {/* 4. Amount Section: ปรับขนาดจาก 6xl เหลือ 4xl เพื่อความสมดุล */}
        <div className="mb-6 text-center">
          <div className="inline-block bg-[#00E676]/10 text-[#00E676] px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-2">
            Total Amount
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-lg font-bold text-[#1a1c1e]">฿</span>
            <span className="text-4xl font-black text-[#1a1c1e] tracking-tighter">55.00</span>
          </div>
        </div>

        {/* 5. Transaction Card: ปรับ Padding และขนาดฟอนต์ให้เล็กลง */}
        <div className="w-full bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 space-y-4">
          <DetailRow label="Type" value="Payment" />
          <div className="h-px bg-gray-50 w-full" />
          <DetailRow label="Shop Name" value="KU Canteen Stall 5 (Green Noodle)" />
          <div className="h-px bg-gray-50 w-full" />
          <DetailRow label="Timestamp" value="Oct 24, 2023 - 12:30 PM" />
          <div className="h-px bg-gray-50 w-full" />
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Transaction ID</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-gray-300">TXN987654321</span>
              <Copy size={12} className="text-[#00E676] opacity-50 hover:opacity-100 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* 6. Action Buttons: ปรับปุ่มให้เพรียวขึ้น */}
        <div className="mt-auto w-full pt-8 space-y-3 flex flex-col items-center">
          <Link href="/wallethome" className="w-full">
            <button className="w-full bg-[#00E676] text-white py-4 rounded-xl font-black text-sm shadow-lg shadow-teal-900/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
              <Home size={18} /> Return to Home
            </button>
          </Link>
          <Link href="/transactionhistory" className="w-full">
            <button className="w-full py-2 flex items-center justify-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-[#035433] transition-colors">
              <History size={14} /> View History
            </button>
          </Link>
        </div>

        {/* 7. University Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 opacity-20 grayscale scale-90">
            <div className="w-5 h-5 bg-[#035433] rounded-full flex items-center justify-center text-white text-[7px] font-bold">KU</div>
            <span className="text-[8px] font-black uppercase tracking-widest">Kasetsart University</span>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-0.5">{label}</span>
      <span className="text-[11px] font-black text-[#1a1c1e] text-right leading-tight max-w-[140px]">{value}</span>
    </div>
  );
}