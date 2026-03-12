/* src/app/staffdashboard/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Menu, ChevronRight, PlusCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import StaffSidebar from '../layout/StaffBar'; 

export default function StaffDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activities, setActivities] = useState<any[]>([]); // ✅ ตั้งเป็น Array ว่างเพื่อกันพัง
  const [userName, setUserName] = useState('Staff Member'); // ✅ State สำหรับชื่อผู้ใช้
  const [loading, setLoading] = useState(true);

  // 🚀 Fetch ข้อมูลและชื่อผู้ใช้
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // ดึงชื่อจาก LocalStorage
        const name = localStorage.getItem('userName');
        if (name) setUserName(name);

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/v1/admin/staff-history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          // เช็คเผื่อ Backend ส่ง null มา ให้เซตเป็น [] แทน
          setActivities(Array.isArray(data) ? data : []); 
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setActivities([]); // กันเหนียว
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden text-left">
      <StaffSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-2 bg-white sticky top-0 z-10 shadow-sm border-b border-gray-50">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors active:scale-90"
          >
            <Menu className="text-gray-400" size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#004D40] rounded-full flex items-center justify-center shadow-inner">
              <span className="text-white font-black text-lg">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-[12px] font-black text-[#00E676] leading-none uppercase tracking-tight">KU Food Court</h1>
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{userName}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8 overflow-y-auto">
        {/* Quick Actions */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            {/* Top-up Card */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 active:scale-[0.98] transition-all">
              <div className="h-40 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] relative flex items-center justify-center">
                <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-xl backdrop-blur-md">
                   <PlusCircle className="text-white" size={24} />
                </div>
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/20 relative">
                   <div className="w-16 h-16 bg-[#00E676] rounded-full blur-2xl absolute opacity-30"></div>
                   <PlusCircle className="text-white relative" size={48} strokeWidth={1.5} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-black text-[#1A1C1E] mb-1">Top-up Customer Wallet</h3>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-4">Add credits to student, staff, or guest cards using cash or QR.</p>
                <Link href="/staffscanner" className="text-[#00E676] font-black text-[12px] uppercase flex items-center gap-1 group">
                  Open Scanner <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                </Link>
              </div>
            </div>

            {/* Refund Card */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 active:scale-[0.98] transition-all">
              <div className="h-40 bg-gradient-to-br from-[#37474F] to-[#263238] relative flex items-center justify-center">
                <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-xl backdrop-blur-md">
                   <RotateCcw className="text-white" size={24} />
                </div>
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/20 relative">
                   <div className="w-16 h-16 bg-[#00E676] rounded-full blur-2xl absolute opacity-30"></div>
                   <RotateCcw className="text-white relative" size={48} strokeWidth={1.5} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-black text-[#1A1C1E] mb-1">Refund Remaining Cash</h3>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-4">Process balance withdrawals for customers leaving the food court.</p>
                <Link href="/staffrefundscanner" className="text-[#00E676] font-black text-[12px] uppercase flex items-center gap-1 group">  
                  Process Refund <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="pt-2 pb-5">
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="font-black text-gray-900 text-lg tracking-tight uppercase leading-none">Recent Activity</h2>
            <Link href="/staffhistory">
              <button className="text-[#035433] text-xs font-black underline underline-offset-4 uppercase">See All</button>
            </Link>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block w-6 h-6 border-2 border-[#035433]/20 border-t-[#035433] rounded-full animate-spin"></div>
              </div>
            ) : activities.length > 0 ? (
              activities.slice(0, 5).map((item: any) => {
                // ✅ แก้ไข Logic การเช็คประเภทรายการให้ครอบคลุม
                const isTopup = item.type.includes('TOPUP');
                
                return (
                  <div key={item.id} className="bg-white p-5 rounded-[1.5rem] flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border ${
                        isTopup 
                          ? 'bg-[#F1FDF7] text-[#035433] border-[#E8F8F0]' 
                          : 'bg-red-50 text-red-500 border-red-100'
                      }`}>
                        {isTopup ? 'T' : 'R'}
                      </div>

                      <div>
                        <h4 className="text-[15px] font-black text-[#1a1c1e] leading-tight mb-0.5 uppercase tracking-tighter">
                          {item.type.replace('_', ' ')}
                        </h4>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[15px] font-black tracking-tight ${
                        isTopup ? 'text-[#035433]' : 'text-red-600'
                      }`}>
                        {isTopup ? '+ ' : '- '}฿{Math.abs(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-[1.5rem] border border-dashed border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No recent transactions</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}