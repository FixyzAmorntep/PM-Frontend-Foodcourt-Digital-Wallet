'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PastSalesPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [merchant, setMerchant] = useState({ name: "PaJong", balance: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:8080/api/v1/payments/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setHistory(data || []);

        const profileRes = await fetch('http://localhost:8080/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profile = await profileRes.json();
        if (profile.user) {
          setMerchant({ name: profile.user.full_name, balance: profile.user.balance });
        }
      } catch (err) {
        console.error("Fetch history failed:", err);
      }
    };
    fetchData();
  }, []);

  const formatDayLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-GB', { weekday: 'long' });
  };

  return (
    // 🚩 ลบ max-w-md mx-auto ออกให้หมด หน้าลูกต้อง "ขยายเต็ม" ตามหน้าพ่อ
    <div className="flex flex-col min-h-screen bg-white font-sans text-[#1A1C1E] w-full">
      
      {/* 🚩 Header Section: ปรับปรุงให้กระจายตัว ไม่เบียดกันแน่นอน */}
      <header className="px-6 py-4 bg-white flex items-center justify-between sticky top-0 z-20 border-b border-gray-100 w-full">
        {/* ฝั่งซ้าย */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="active:scale-90 transition-transform">
            <ArrowLeft className="text-gray-700" size={22} />
          </button>
          <h1 className="text-[17px] font-black tracking-tight text-gray-700 whitespace-nowrap">
            Seller Home
          </h1>
        </div>

        {/* ฝั่งขวา */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] font-black text-[#006064] leading-tight truncate max-w-[70px]">
              {merchant.name}
            </p>
            <p className="text-[13px] font-black text-[#006064]">
              ฿{merchant.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-10 h-10 bg-[#E0ECEE] rounded-full flex-shrink-0 flex items-center justify-center text-[#006064]">
            <User size={20} fill="currentColor" />
          </div>
        </div>
      </header>

      <main className="flex-1 bg-white">
        {/* Table Header: ปรับช่องว่างให้กว้างขึ้น */}
        <div className="grid grid-cols-3 px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-[#FBFDFD]">
          <span>Date</span>
          <span className="text-center">Orders</span>
          <span className="text-right">Total</span>
        </div>

        {/* Sales List */}
        <div className="divide-y divide-gray-50">
          {history.length > 0 ? (
            history.map((item: any, index: number) => (
              <div key={index} className="grid grid-cols-3 px-6 py-5 items-center hover:bg-gray-50 transition-colors">
                <div className="flex flex-col">
                  <span className="text-[14px] font-black text-gray-800">
                    {new Date(item.sale_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-[11px] text-[#006064] font-bold opacity-60">
                    {formatDayLabel(item.sale_date)}
                  </span>
                </div>
                <span className="text-center text-[15px] font-bold text-gray-500">
                  {item.order_count}
                </span>
                <span className="text-right text-[15px] font-black text-[#006064]">
                  ฿{item.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-gray-400 font-bold text-sm">
              No sales history found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}