'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, LogOut, Bell, User, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const result = await response.json();
          // 🚩 เก็บข้อมูล User ทั้งก้อน รวมถึง Role จริงๆ จาก DB
          setUserData(result.user);
          
          // ✅ อัปเดต localStorage ให้ตรงกับความจริงด้วย เผื่อหน้าอื่นเอาไปใช้
          localStorage.setItem('user_role', result.user.role);
        } else {
          // ถ้า Token หมดอายุหรือผิดพลาด ให้ดีดออกไปหน้า Login
          router.push('/');
        }
      } catch (error) {
        console.error("Settings fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  // กำหนดสีตาม Role เพื่อความสวยงาม
  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return 'text-red-500 border-red-100 bg-red-50';
      case 'STAFF': return 'text-blue-500 border-blue-100 bg-blue-50';
      case 'VENDOR': return 'text-[#006064] border-cyan-100 bg-cyan-50';
      default: return 'text-[#035433] border-green-100 bg-green-50';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFB] font-sans h-screen overflow-y-auto w-full">
      
      {/* 1. Header Bar */}
      <div className="flex justify-between items-center px-6 py-5 bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="active:scale-90 transition-transform">
            <ChevronLeft className="text-[#006064]" size={24} strokeWidth={3} />
          </button>
          <h1 className="text-xl font-black text-[#1a1c1e] tracking-tight">Settings</h1>
        </div>
        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
          <Bell size={20} />
        </div>
      </div>

      <div className="px-6 py-8 flex-1 flex flex-col items-center max-w-md mx-auto w-full">
        
        {/* 2. Profile Avatar Section */}
        <div className="relative mb-6">
          <div className={`w-32 h-32 rounded-full border-4 border-gray-100 p-1`}>
            <div className="w-full h-full bg-[#E0ECEE] rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-[#006064]">
              <User size={50} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* 3. User Info Summary */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-[#1a1c1e] leading-tight">
            {userData?.full_name || 'Loading...'}
          </h2>
          
          <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 border rounded-full shadow-sm ${getRoleColor(userData?.role)}`}>
            <ShieldCheck size={12} />
            <p className="text-[10px] font-black uppercase tracking-widest">
              {/* 🚩 แสดง Role ตรงๆ จาก Database */}
              {userData?.role || 'Checking...'} Account
            </p>
          </div>
          
          <p className="text-[12px] font-bold text-gray-400 mt-2">
            {userData?.phone || userData?.email}
          </p>
        </div>

        {/* 4. Action Cards */}
        <div className="w-full space-y-4">
          <button 
            onClick={() => router.push('/changepassword')}
            className="w-full bg-white p-5 rounded-[1.5rem] border border-gray-50 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                <Lock size={20} />
              </div>
              <h3 className="font-black text-[14px] text-[#1a1c1e]">Change Password</h3>
            </div>
            <ChevronRight className="text-gray-200" size={18} />
          </button>

          <button 
            onClick={handleLogout}
            className="w-full bg-white p-5 rounded-[1.5rem] border border-red-50 shadow-sm flex items-center active:scale-[0.98] transition-all"
          >
            <div className="w-11 h-11 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mr-4">
              <LogOut size={20} />
            </div>
            <span className="font-black text-[14px] text-red-500 uppercase tracking-widest">Logout</span>
          </button>
        </div>

        <div className="mt-auto pt-10 text-center opacity-30">
          <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase">
            KU Food Court Digital v2.6.0
          </p>
        </div>
      </div>
    </div>
  );
}