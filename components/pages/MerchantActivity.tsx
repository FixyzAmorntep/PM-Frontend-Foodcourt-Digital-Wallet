'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ActivityHistoryPage() {
  const router = useRouter();
  
  const [pageData, setPageData] = useState({
    activities: [],
    merchantName: "Loading...",
    balance: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const profileRes = await fetch('http://localhost:8080/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profile = await profileRes.json();

        const res = await fetch('http://localhost:8080/api/v1/payments/activities', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const activities = await res.json();

        setPageData({
          activities: activities || [],
          merchantName: profile.user.full_name || "ป้าจง",
          balance: profile.user.balance || 0
        });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [router]);

  const groupedActivities = pageData.activities.reduce((groups: any, activity: any) => {
    const date = new Date(activity.created_at).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(activity);
    return groups;
  }, {});

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'TODAY';
    if (date.toDateString() === yesterday.toDateString()) return 'YESTERDAY';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  };

  return (
    // 🚩 ตัด max-w-md และ mx-auto ตรงนี้ออกเพื่อให้ขยายตาม Layout พ่อ (430px)
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] font-sans text-[#1A1C1E] w-full">
      
      {/* 🚩 Header: ปรับปรุงให้กระจายตัว ไม่เบียดกัน */}
      <header className="w-full bg-white sticky top-0 z-20 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        {/* ฝั่งซ้าย */}
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="active:scale-90 transition-transform">
            <ArrowLeft className="text-gray-500" size={22} />
          </button>
          <h1 className="text-[17px] font-black tracking-tight text-gray-700 whitespace-nowrap">
            Seller Home
          </h1>
        </div>

        {/* ฝั่งขวา */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] font-black text-[#006064] leading-tight truncate max-w-[80px]">
              {pageData.merchantName}
            </p>
            <p className="text-[13px] font-black text-[#006064]">
              ฿{pageData.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-10 h-10 bg-[#E0ECEE] rounded-full flex-shrink-0 flex items-center justify-center text-[#006064]">
            <User size={20} fill="currentColor" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {Object.keys(groupedActivities).length > 0 ? (
          Object.keys(groupedActivities).map((date) => (
            <section key={date} className="mb-4">
              <div className="px-6 py-3 bg-[#F1F5F9] text-[#64748B] text-[10px] font-black tracking-[0.15em] border-y border-gray-50">
                {getDayLabel(date)}
              </div>

              <div className="bg-white divide-y divide-gray-50">
                {groupedActivities[date].map((item: any) => (
                  <div key={item.id} className="px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[14px] font-black text-gray-800 uppercase tracking-tight">
                        TXN-{item.id.slice(0, 6)}
                      </p>
                      <p className="text-[11px] text-gray-400 font-bold">Ref: REF-{item.id.slice(0, 8)}</p>
                    </div>
                    <div className="text-right flex flex-col gap-0.5">
                      <p className="text-[15px] font-black text-[#00C853]">
                        +฿{item.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="p-20 text-center text-gray-400 font-bold text-sm bg-white h-full">
            No activity history found
          </div>
        )}
      </main>
    </div>
  );
}