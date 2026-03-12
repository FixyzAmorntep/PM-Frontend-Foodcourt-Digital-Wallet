'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, PlusCircle, RotateCcw, User } from 'lucide-react';
import Link from 'next/link';

export default function TransactionHistory() {
  // 🚩 ปรับให้เริ่มต้นเป็น [] เสมอเพื่อกันพังตอน .length
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/v1/admin/staff-history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          // 🚩 เช็คว่าถ้า Backend ส่ง null มา ให้เซตเป็น Array ว่างแทน
          setTransactions(Array.isArray(data) ? data : []);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error("Fetch history error:", err);
        setTransactions([]); // กันระเบิดถ้า Fetch พัง
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] font-sans overflow-hidden text-left">
      
      {/* 1. Header Bar */}
      <div className="flex items-center px-6 py-5 bg-white border-b border-gray-50 shrink-0 z-30 shadow-sm">
        <Link href="/staffdashboard" className="p-1 text-[#00E676]">
          <ChevronLeft className="text-[#00E676] active:scale-90 transition-transform" size={24} strokeWidth={3} />
        </Link>
        <h1 className="flex-1 text-center text-lg font-black text-[#1a1c1e] tracking-tight mr-6 uppercase">
          Transaction Logs
        </h1>
      </div>

      {/* 2. Content Section */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-6">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-4 border-b border-gray-50 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
            <div className="col-span-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer</div>
            <div className="col-span-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Type & Time</div>
            <div className="col-span-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</div>
          </div>

          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="py-20 text-center uppercase text-[10px] font-black text-gray-300 animate-pulse">
                Fetching records...
              </div>
            ) : (transactions && transactions.length > 0) ? (
              transactions.map((item) => {
                // 🚩 Logic เช็คว่าเป็นรายการเงินเข้า (Topup) หรือเงินออก (Refund)
                const isTopup = item.type?.includes('TOPUP');
                
                return (
                  <div key={item.id} className="grid grid-cols-12 px-6 py-5 items-center hover:bg-gray-50/50 transition-colors">
                    
                    {/* 1. Customer Info */}
                    <div className="col-span-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                          <User size={14} className="text-gray-400" />
                        </div>
                        <div className="truncate">
                          <p className="text-[11px] font-black text-gray-800 leading-none mb-1 truncate">
                            {item.customer_name || 'System User'}
                          </p>
                          <p className="text-[8px] font-bold text-gray-300 tracking-widest">
                            #{String(item.id).slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 2. Type & Time */}
                    <div className="col-span-5 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border mb-1 ${
                        isTopup ? 'bg-emerald-50 border-emerald-100 text-[#006D5B]' : 'bg-rose-50 border-rose-100 text-rose-500'
                      }`}>
                         {isTopup ? <PlusCircle size={10} /> : <RotateCcw size={10} />}
                         <span className="text-[9px] font-black uppercase tracking-tighter">
                           {item.type?.replace('TOPUP_', '') || 'Action'}
                         </span>
                      </div>
                      <p className="text-[9px] font-bold text-gray-300 block">
                        {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </p>
                    </div>

                    {/* 3. Amount */}
                    <div className="col-span-3 text-right">
                      <span className={`text-[13px] font-black ${
                        isTopup ? 'text-[#006D5B]' : 'text-rose-600'
                      }`}>
                        {isTopup ? '+' : '-'} ฿{Math.abs(item.amount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No activity history found</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center pb-10 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          End of history records
        </p>
      </div>
    </div>
  );
}