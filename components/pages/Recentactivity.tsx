/* src/components/pages/TransactionHistory.tsx */
'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Transaction } from '@/lib/walletUtils'; //
import { MOCK_USERS } from '@/lib/mockData';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // ดึงข้อมูลประวัติจริงจากระบบแยกตามบัญชี
    const savedPhone = localStorage.getItem('userPhone');
    const savedName = localStorage.getItem('userName');
    const user = MOCK_USERS.find(u => u.name === savedName || u.phone === savedPhone);

    if (user && savedPhone) {
      const historyKey = `history_${savedPhone}`;
      const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      setTransactions(savedHistory);
    }
  }, []);

  return (
    // กำหนด h-screen และ flex-col เพื่อให้ส่วนเนื้อหาเลื่อนได้ภายในหน้าจอ
    <div className="flex flex-col h-screen bg-[#F8FAFB] font-sans overflow-hidden">
      
      {/* 1. Header Bar - ใช้ sticky top เพื่อให้คงที่ตลอดเวลา */}
      <div className="flex items-center px-6 py-5 bg-white border-b border-gray-50 shrink-0 z-30">
        <Link href="/wallethome">
          <ChevronLeft className="text-[#00E676] active:scale-90 transition-transform" size={24} strokeWidth={3} />
        </Link>
        <h1 className="flex-1 text-center text-lg font-black text-[#1a1c1e] tracking-tight mr-6 uppercase">
          Recent Activity
        </h1>
      </div>

      {/* 2. Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        
        {/* Table Card */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden mb-6">
          
          {/* Table Header (ล็อคไว้กับที่ด้านบนของ Card) */}
          <div className="grid grid-cols-12 px-6 py-4 border-b border-gray-50 bg-gray-50/30 sticky top-0 z-10 backdrop-blur-md">
            <div className="col-span-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Date & Time</div>
            <div className="col-span-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Transaction Type</div>
            <div className="col-span-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</div>
          </div>

          {/* รายการประวัติที่เลื่อนดูได้ */}
          <div className="divide-y divide-gray-50">
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <div key={item.id} className="grid grid-cols-12 px-6 py-5 items-center hover:bg-gray-50 transition-colors active:bg-gray-100/50">
                  
                  {/* Date & Time */}
                  <div className="col-span-4">
                    <p className="text-[11px] font-black text-gray-800 mb-0.5">
                      {item.time.split(',')[0]}
                    </p>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">
                      {item.time.split(',')[1]?.trim()}
                    </p>
                  </div>

                  {/* Transaction Type */}
                  <div className="col-span-5 flex items-center gap-2.5 overflow-hidden">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      item.amount > 0 ? 'bg-[#00E676]' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-[11px] font-black text-gray-600 uppercase truncate">
                      {item.title}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="col-span-3 text-right">
                    <span className={`text-[11px] font-black ${
                      item.amount > 0 ? 'text-[#00E676]' : 'text-gray-900'
                    }`}>
                      {item.amount > 0 ? '+ ' : '- '}฿{Math.abs(item.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                   <RefreshCw size={24} className="animate-spin-slow" />
                </div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest font-sans">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Text ท้ายรายการ */}
        <p className="text-center pb-10 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          Showing last 30 days of activity
        </p>
      </div>
    </div>
  );
}