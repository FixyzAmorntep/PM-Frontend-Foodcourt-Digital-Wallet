'use client';

import React from 'react';
import { ChevronLeft, CheckCircle2, Share2, Download } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation'; // ✅ เพิ่ม useSearchParams

export default function TopupSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ ดึง Params จาก URL

  // ดึงค่าจาก URL ถ้าไม่มีให้ใช้ค่า Default
  const amount = searchParams.get('amount') || "0.00";
  const phone = searchParams.get('phone') || "Unknown";
  const refNo = "KU-" + Math.floor(1000000 + Math.random() * 9000000); // สุ่มเลข Ref ใหม่ทุกครั้ง
  const timestamp = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFB] font-sans">
      <header className="px-6 py-5 bg-white flex items-center sticky top-0 z-20">
        <button onClick={() => router.push('/staffscanner')} className="p-1 text-[#00E676]">
          <ChevronLeft size={28} strokeWidth={3} />
        </button>
        <h1 className="flex-1 text-center mr-8 text-lg font-black text-[#1A1C1E]">Receipt Details</h1>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="mt-4 mb-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={56} className="text-[#00E676]" fill="currentColor" fillOpacity={0.2} />
          </div>
          <h2 className="text-2xl font-black text-[#1A1C1E] mb-2">Transaction Successful</h2>
          <p className="text-[12px] font-bold text-gray-400">Order processed for KU Food Court</p>
        </div>

        <div className="w-full bg-white rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="pt-10 pb-8 text-center border-b border-dashed border-gray-100">
            <p className="text-[11px] font-black text-[#00E676] uppercase tracking-[0.2em] mb-2">Amount Paid</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-black text-[#1A1C1E]">฿</span>
              {/* ✅ แสดงยอดเงินที่ส่งมาจากหน้าเดิม */}
              <span className="text-5xl font-black text-[#1A1C1E] tracking-tighter">{parseFloat(amount).toFixed(2)}</span>
            </div>
          </div>

          <div className="p-8 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Transaction Type</span>
              <span className="text-[13px] font-black text-[#1A1C1E]">Cash Top-up (Staff)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Number</span>
              {/* ✅ แสดงเบอร์โทรที่ส่งมาจากหน้าเดิม */}
              <span className="text-[13px] font-black text-[#1A1C1E]">{phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Reference No.</span>
              <div className="text-right">
                <p className="text-[13px] font-black text-[#1A1C1E] leading-none mb-1">{refNo}</p>
                <p className="text-[9px] font-black text-[#00E676] uppercase tracking-widest">Verified</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Timestamp</span>
              <span className="text-[13px] font-black text-[#1A1C1E]">{timestamp}</span>
            </div>
          </div>

          <div className="px-8 py-8 bg-[#F8FAFB] flex flex-col items-center border-t border-gray-50">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] text-center">
              Digital Signature:<br/>
              STAFF_VERIFIED_{refNo}
            </p>
          </div>
        </div>
      </main>

      <footer className="p-8">
        <button 
          onClick={() => router.push('/staff/dashboard')}
          className="w-full bg-[#1A1C1E] text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em]"
        >
          Back to Home
        </button>
      </footer>
    </div>
  );
}