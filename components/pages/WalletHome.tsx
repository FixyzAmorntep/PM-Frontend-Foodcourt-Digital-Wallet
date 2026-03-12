'use client';

import React, { useEffect, useState } from 'react';
import { Menu, Bell, RefreshCw, QrCode, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WalletHome({ openMenu }: { openMenu: () => void }) {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    const token = localStorage.getItem('token');
    
    // 🛡️ Security Check: ถ้าไม่มี Token ให้ดีดกลับหน้า Login ทันที
    if (!token) {
      router.push('/');
      return;
    }

    try {
      // 🚀 1. ดึงข้อมูล Wallet จาก Backend (อิงตาม Path /api/v1/wallet)
      // หมายเหตุ: ฟลุ๊คเช็คไฟล์ wallet.go อีกทีนะว่าเพื่อนใช้ /me หรือ /profile
      const response = await fetch('http://localhost:8080/api/v1/wallet/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData({
          name: localStorage.getItem('userName') || 'KU User',
          balance: data.balance // ยอดเงินสดๆ จาก MySQL
        });
      } else if (response.status === 401) {
        // Token หมดอายุ หรือ Invalid
        localStorage.clear();
        router.push('/');
      }

      // 🚀 2. ดึงประวัติรายการล่าสุด (ถ้า Backend มี API เส้นนี้)
      const transResponse = await fetch('http://localhost:8080/api/v1/wallet/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (transResponse.ok) {
        const transData = await transResponse.json();
        setTransactions(Array.isArray(transData) ? transData.slice(0, 3) : []);
      }

    } catch (error) {
      console.error("Fetch Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // ดึงข้อมูลใหม่เมื่อกลับมาที่หน้านี้
    window.addEventListener('focus', refreshData);
    return () => window.removeEventListener('focus', refreshData);
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-5 bg-white border-b border-gray-50 sticky top-0 z-20">
        <button onClick={openMenu} className="hover:opacity-70 transition-opacity active:scale-90">
          <Menu className="text-[#035433]" size={24} />
        </button>
        <h1 className="text-lg font-black text-[#035433] tracking-tight uppercase text-center font-sans leading-none">KU FOOD COURT</h1>
        <div className="relative">
          <Bell className="text-[#035433]" size={24} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white font-sans">
        {/* Wallet Card */}
        <div className="bg-[#035433] rounded-[1rem] p-8 text-white relative overflow-hidden shadow-[0_10px_40px_rgba(3,84,51,0.25)]">
          <div className="relative z-10 font-sans">
            <p className="text-[10px] opacity-80 mb-1 font-bold uppercase tracking-wider">KU Green Wallet</p>
            <div className="flex items-center gap-2 mb-8">
              <span className="text-5xl font-bold">฿</span>
              <span className="text-5xl font-black tracking-tighter text-white">
                {loading ? "..." : (userData?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="opacity-60 font-bold tracking-wide">
                {loading ? "Updating..." : "Updated just now"}
              </span>
              <button 
                onClick={() => { setLoading(true); refreshData(); }} 
                className="bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-white/30 transition-all active:scale-95 font-black"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/qrtopup" className="contents">
            <button className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:bg-gray-50 transition-colors">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-[#035433]"><QrCode size={28}/></div>
              <span className="text-[10px] font-black text-gray-700 text-center uppercase tracking-tighter leading-tight">Top-up via QR<br/>PromptPay</span>
            </button>
          </Link>
          <Link href="/cashrefund" className="contents">
            <button className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:bg-gray-50 transition-colors">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-[#035433]"><Wallet size={28}/></div>
              <span className="text-[10px] font-black text-gray-700 text-center uppercase tracking-tighter leading-tight">Top-up Cash<br/>& Refund</span>
            </button>
          </Link>
        </div>

        <Link href="/scanpay">
          <button className="w-full bg-[#035433] text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-[0_5px_15px_rgba(2,59,36,0.3)] uppercase tracking-[0.2em] active:scale-[0.98] transition-all">
            <QrCode size={24} /> Pay Now
          </button>
        </Link>

        {/* Recent Activity */}
        <div className="pt-2 pb-10">
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="font-black text-gray-900 text-lg tracking-tight uppercase leading-none">Recent Activity</h2>
            <Link href="/recentactivity">
              <button className="text-[#035433] text-xs font-black underline underline-offset-4 uppercase">See All</button>
            </Link>
          </div>
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <TransactionItem 
                  key={item.id} 
                  title={item.type || "Transaction"} 
                  time={new Date(item.created_at).toLocaleString()} 
                  amount={item.amount} 
                />
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No recent transactions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function TransactionItem({ title, time, amount }: any) {
  // 🚩 กำหนดเงื่อนไขว่าธุรกรรมไหนคือ "เงินออก"
  // ในระบบของฟลุ๊คประกอบด้วย PAYMENT (จ่ายข้าว) และ REFUND (แลกคืนเงินสด)
  const isNegative = amount < 0 || title === 'PAYMENT' || title === 'REFUND';

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all">
      <div className="flex items-center gap-4">
        {/* ไอคอนวงกลมเปลี่ยนสีตามสถานะ */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black uppercase text-xs border ${
          isNegative ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-[#035433] border-green-100'
        }`}>
          {title[0]}
        </div>
        <div>
          <h3 className="font-black text-sm text-gray-800 tracking-tight leading-none mb-1 uppercase">{title}</h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">{time}</p>
        </div>
      </div>
      
      {/* 🔴 การแสดงผลตัวเลข: ถ้าเป็นเงินออกให้ติดลบและเป็นสีแดง */}
      <span className={`font-black text-sm tracking-tight ${isNegative ? 'text-red-600' : 'text-[#035433]'}`}>
        {isNegative 
          ? `- ฿${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
          : `+ ฿${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        }
      </span>
    </div>
  );
}