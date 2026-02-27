/* src/components/pages/Settings.tsx */
'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, LogOut, Bell, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_USERS } from '@/lib/mockData'; // เพิ่มการดึงข้อมูล Mock

export default function Settings() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null); // เพิ่ม State เก็บข้อมูล

  useEffect(() => {
    // ดึงชื่อที่เก็บไว้ตอน Login มาหาข้อมูลใน MockData
    const savedName = localStorage.getItem('userName');
    const foundUser = MOCK_USERS.find(u => u.name === savedName);
    
    if (foundUser) {
      setUserData(foundUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPhone'); 
    
    router.push('/');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFB] font-sans h-full">
      
      {/* 1. Header Bar */}
      <div className="flex justify-between items-center px-6 py-5 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {/* แก้ Link ให้กลับไปหน้าแรก (Home) */}
          <Link href="/wallethome">
            <ChevronLeft className="text-[#00E676]" size={24} strokeWidth={3} />
          </Link>
          <h1 className="text-xl font-black text-[#1a1c1e] tracking-tight">Settings</h1>
        </div>
        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#00E676]">
          <Bell size={20} />
        </div>
      </div>

      <div className="px-6 py-8 flex-1 flex flex-col items-center">
        
        {/* 2. Profile Section - ดึง Avatar ตามชื่อผู้ใช้ */}
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-[#00E676]/20 p-1">
            <div className="w-full h-full bg-[#FFE0B2] rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || 'Jane'}`} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          <button className="absolute bottom-1 right-1 bg-[#00E676] text-white p-2 rounded-full border-4 border-[#F8FAFB] shadow-sm active:scale-90 transition-all">
            <Edit2 size={14} strokeWidth={3} />
          </button>
        </div>

        <div className="text-center mb-10">
          {/* ดึงชื่อจริงจาก userData */}
          <h2 className="text-2xl font-black text-[#1a1c1e] leading-tight">
            {userData?.name || 'Loading...'}
          </h2>
          {/* ดึงรหัสนิสิตหรือบทบาท */}
          <p className="text-sm font-black text-[#00E676] mt-1 uppercase tracking-wider">
            {userData?.role === 'customer' ? `Student ID: ${userData?.studentId}` : 'Merchant Account'}
          </p>
          <p className="text-xs font-bold text-gray-300 mt-1">{userData?.phone || 'No Email'}</p>
        </div>

        {/* 3. Account Security Card */}
        <div className="w-full space-y-4">
          <p className="px-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">
            Account Security
          </p>
          
          <button className="w-full bg-white p-5 rounded-[1.5rem] border border-gray-50 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#00E676]">
                <Lock size={22} />
              </div>
              <div className="text-left">
                <h3 className="font-black text-[15px] text-[#1a1c1e]">Change Password</h3>
                <p className="text-[10px] font-bold text-gray-300 mt-0.5">Last updated 3 months ago</p>
              </div>
            </div>
            <ChevronRight className="text-gray-200 transition-colors" size={20} />
          </button>

          {/* Logout Card - ใส่ handleLogout เข้าไป */}
          <button 
            onClick={handleLogout}
            className="w-full bg-white p-5 rounded-[1.5rem] border border-gray-50 shadow-sm flex items-center group active:scale-[0.98] transition-all"
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mr-4">
              <LogOut size={22} />
            </div>
            <span className="font-black text-[15px] text-red-500">Logout</span>
          </button>
        </div>

        {/* 4. App Version Footer */}
        <div className="mt-auto pt-10 text-center opacity-30">
          <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
            KU Food App v2.4.8 (Build 1024)
          </p>
          <p className="text-[9px] font-bold text-gray-300 mt-1">
            Made with green heart at KU
          </p>
        </div>
      </div>
    </div>
  );
}