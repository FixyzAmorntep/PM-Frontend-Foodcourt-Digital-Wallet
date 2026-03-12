'use client';

import React, { useState, useEffect } from 'react';
import { Menu, User, QrCode, FileText, History, ExternalLink, ScanLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
// 🚩 นำเข้า MerchantBar จากโฟลเดอร์ layout
import MerchantBar from '../layout/MerchantBar'; 

export default function MerchantDashboard() {
  const router = useRouter();
  
  // 🚩 1. สร้าง State สำหรับเปิด/ปิด MerchantBar ภายในหน้านี้
  const [isBarOpen, setIsBarOpen] = useState(false);

  const [salesData, setSalesData] = useState({
    todaySales: 0,
    orderCount: 0,
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

        const summaryRes = await fetch('http://localhost:8080/api/v1/payments/metrics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const summary = await summaryRes.json();

        setSalesData({
          todaySales: summary.today_sales || 0,
          orderCount: summary.today_orders || 0,
          merchantName: profile.user.full_name || "ป้าจง",
          balance: profile.user.balance || 0
        });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [router]);

  return (
    // 🚩 ใช้ relative เพื่อให้ MerchantBar ที่เป็น fixed/absolute อ้างอิงตำแหน่งได้ถูกต้อง
    <div className="relative flex flex-col min-h-screen bg-[#F8F9FA] font-sans text-[#1A1C1E] w-full overflow-x-hidden">
      
      {/* 🚩 2. วาง MerchantBar ไว้ที่นี่ โดยส่ง State เข้าไปควบคุม */}
      <MerchantBar 
        isOpen={isBarOpen} 
        onClose={() => setIsBarOpen(false)} 
      />

      {/* Header Section */}
      <header className="px-6 py-4 bg-white flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          {/* 🚩 3. ปุ่มเมนูสั่งเปิด Local State (setIsBarOpen) */}
          <button 
            onClick={() => setIsBarOpen(true)} 
            className="p-1 -ml-1 active:scale-90 transition-transform hover:bg-gray-50 rounded-full"
          >
            <Menu className="text-gray-500" size={22} />
          </button>
          <h1 className="text-[17px] font-black tracking-tight text-gray-700">Seller Home</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] font-black text-[#006064] leading-tight">{salesData.merchantName}</p>
            <p className="text-[13px] font-black text-[#006064]">฿{salesData.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="w-10 h-10 bg-[#E0ECEE] rounded-full flex items-center justify-center text-[#006064]">
            <User size={20} fill="currentColor" />
          </div>
        </div>
      </header>

      <main className="p-6 space-y-7 overflow-y-auto flex-1">
        {/* Daily Metrics Section */}
        <section className="space-y-3">
          <h2 className="text-[14px] font-black text-gray-800 uppercase tracking-widest ml-1 opacity-50">Daily Metrics</h2>
          <div className="space-y-3">
            <div className="bg-[#E4F0F0] p-6 rounded-[2rem] border border-[#D0E2E2] relative overflow-hidden shadow-sm">
              <p className="text-[10px] font-black text-[#4E8E8E] uppercase tracking-widest mb-1">Today's Sales</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-black text-[#006064]">฿</span>
                <span className="text-[32px] font-black text-[#006064] tracking-tighter">
                  {salesData.todaySales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="bg-[#E9F0F2] p-6 rounded-[2rem] border border-[#D8E4E6] flex justify-between items-center relative overflow-hidden shadow-sm">
              <div>
                <p className="text-[10px] font-black text-[#5E7A81] uppercase tracking-widest mb-1">Daily Order Count</p>
                <span className="text-[32px] font-black text-[#004D50] tracking-tighter">{salesData.orderCount}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="space-y-3 pb-10">
          <h2 className="text-[14px] font-black text-gray-800 uppercase tracking-widest ml-1 opacity-50">Quick Actions</h2>
          <div className="space-y-3">
            <ActionCard 
              icon={<QrCode className="text-[#00796B]" size={22} />}
              title="Receive Payment"
              desc="Accept payments instantly via QR Code scanning"
              buttonText="OPEN SCANNER"
              buttonIcon={<ScanLine size={18} />}
              onClick={() => router.push('/merchantreceivepayment')}
            />

            <ActionCard 
              icon={<FileText className="text-[#0277BD]" size={22} />}
              title="Past Sales"
              desc="Detailed view of your food stall's sales performance"
              buttonText="VIEW SALES"
              buttonIcon={<ExternalLink size={18} />}
              onClick={() => router.push('/merchantpastsale')}
            />

            <ActionCard 
              icon={<History className="text-gray-500" size={22} />}
              title="Activity History"
              desc="Check recent transaction logs and stall activities"
              buttonText="VIEW HISTORY"
              buttonIcon={<History size={18} />}
              onClick={() => router.push('/merchantactivity')}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

// ActionCard Component
function ActionCard({ icon, title, desc, buttonText, buttonIcon, onClick, bgColor = "bg-[#E0F2F1]" }: any) {
  return (
    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-start gap-4">
        <div className={`p-3 ${bgColor} rounded-[1.2rem]`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-black text-gray-800 leading-none mb-1">{title}</h3>
          <p className="text-[11px] font-medium text-gray-400 leading-tight pr-4">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onClick}
        className="w-full bg-[#00695C] text-white py-3.5 rounded-[1.2rem] font-black text-[13px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
      >
        {buttonIcon} {buttonText}
      </button>
    </div>
  );
}