'use client';

import React from 'react';
import { ChevronLeft, AlertCircle, Share2, Download } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function StaffRefundSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ดึงค่าจาก URL
  const amount = searchParams.get('amount') || "0.00";
  const phone = searchParams.get('phone') || "Unknown";
  const name = searchParams.get('name') || "Customer Name";
  
  // สุ่มเลข Ref สำหรับงาน Refund
  const refNo = "RFD-" + Math.floor(1000000 + Math.random() * 9000000);
  const timestamp = new Date().toLocaleString('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric', 
    hour: '2-digit', minute: '2-digit', second: '2-digit' 
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFB] font-sans">
      {/* Header - เปลี่ยนสีปุ่ม Back เป็นสีแดง */}
      <header className="px-6 py-5 bg-white flex items-center sticky top-0 z-20 shadow-sm">
        <button onClick={() => router.push('/staffdashboard')} className="p-1 text-[#FF3B30]">
          <ChevronLeft size={28} strokeWidth={3} />
        </button>
        <h1 className="flex-1 text-center mr-8 text-lg font-black text-[#1A1C1E] uppercase tracking-tight">Refund Receipt</h1>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center">
        {/* Status Icon - ใช้ AlertCircle สีแดง */}
        <div className="mt-4 mb-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#FFF5F5] rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={56} className="text-[#FF3B30]" fill="currentColor" fillOpacity={0.1} />
          </div>
          <h2 className="text-2xl font-black text-[#1A1C1E] mb-2">Refund Successful</h2>
          <p className="text-[12px] font-bold text-gray-400">Cash returned to customer</p>
        </div>

        {/* Receipt Card */}
        <div className="w-full bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-50">
          <div className="pt-10 pb-8 text-center border-b border-dashed border-gray-100 relative">
            {/* ตกแต่งรอยปรุข้างใบเสร็จ */}
            <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-[#F8FAFB] rounded-full border-r border-gray-50"></div>
            <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-[#F8FAFB] rounded-full border-l border-gray-50"></div>
            
            <p className="text-[11px] font-black text-[#FF3B30] uppercase tracking-[0.2em] mb-2">Total Refunded</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-black text-[#1A1C1E]">฿</span>
              <span className="text-5xl font-black text-[#1A1C1E] tracking-tighter">
                {parseFloat(amount).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="p-8 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Transaction Type</span>
              <span className="text-[13px] font-black text-red-600 uppercase tracking-tighter">Cash Refund (Staff)</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer Name</span>
              <span className="text-[13px] font-black text-[#1A1C1E]">{name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</span>
              <span className="text-[13px] font-black text-[#1A1C1E]">{phone}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Reference No.</span>
              <div className="text-right">
                <p className="text-[13px] font-black text-[#1A1C1E] leading-none mb-1">{refNo}</p>
                <p className="text-[9px] font-black text-[#FF3B30] uppercase tracking-widest">Verified</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Timestamp</span>
              <span className="text-[13px] font-black text-[#1A1C1E]">{timestamp}</span>
            </div>
          </div>

          <div className="px-8 py-8 bg-[#FDFDFD] flex flex-col items-center border-t border-gray-50">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] text-center leading-relaxed">
              KU Food Court Digital Signature:<br/>
              REFUND_STAFF_AUTH_{refNo}
            </p>
          </div>
        </div>
      </main>

      <footer className="p-8">
        <button 
          onClick={() => router.push('/staffdashboard')}
          className="w-full bg-[#1A1C1E] text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
        >
          Back to Home
        </button>
      </footer>
    </div>
  );
}