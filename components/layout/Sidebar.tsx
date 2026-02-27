/* src/components/layout/Sidebar.tsx */
'use client';

import { Home, History, Settings, LogOut, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MOCK_USERS } from '@/lib/mockData'; // ดึงข้อมูล Mock

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname(); // ใช้เช็คว่าอยู่หน้าไหนเพื่อทำเมนูสีเขียว
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // ดึงชื่อที่เก็บไว้ตอน Login มาหาข้อมูลใน MockData
    const savedName = localStorage.getItem('userName');
    const user = MOCK_USERS.find(u => u.name === savedName);
    if (user) setUserData(user);
  }, [isOpen]); // อัปเดตข้อมูลทุกครั้งที่เปิด Sidebar

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPhone'); 
    
    onClose();
    router.push('/');
  };

  return (
    <>
      {/* 1. Overlay */}
      <div 
        className={`absolute inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 2. Sidebar Panel */}
      <div className={`absolute top-0 left-0 w-[280px] h-full bg-white z-50 transform transition-transform duration-300 ease-in-out font-sans ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* ส่วนหัว (Header Section) ดึงข้อมูลจริง */}
        <div className="bg-[#035433] p-8 pt-12 rounded-br-[3rem] text-white flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-white/50 flex items-center justify-center overflow-hidden bg-white/10">
            <UserCircle size={40} className="text-white/80" />
          </div>
          <div>
            <p className="text-[10px] opacity-70 font-black uppercase tracking-widest leading-none mb-1">
              {'Welcome'}
            </p>
            <p className="text-sm font-black tracking-tight">
              {userData?.phone || 'Loading...'}
            </p>
          </div>
        </div>

        {/* รายการเมนู (Menu Items) - ใช้ pathname เช็คสถานะ active */}
        <nav className="p-4 mt-4 flex flex-col gap-2">
          <MenuLink icon={<Home size={20}/>} label="Home" href="/wallethome" active={pathname === '/wallethome'} onClose={onClose} />
          <MenuLink icon={<History size={20}/>} label="History" href="/transactionhistory" active={pathname === '/transactionhistory'} onClose={onClose} />
          <MenuLink icon={<Settings size={20}/>} label="Settings" href="/settings" active={pathname === '/settings'} onClose={onClose} />
        </nav>

        {/* ส่วนท้าย (Footer Section) */}
        <div className="absolute bottom-10 left-0 w-full px-6 flex flex-col items-center gap-4">
          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-widest"
          >
            <LogOut size={20} /> Logout
          </button>
          <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em]">
            KU Food App v2.4.8
          </p>
        </div>
      </div>
    </>
  );
}

function MenuLink({ icon, label, href, active, onClose }: any) {
  return (
    <Link href={href} onClick={onClose}>
      <div className={`flex items-center gap-4 p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${
        active ? 'bg-green-50 text-[#035433]' : 'text-gray-400 hover:bg-gray-50'
      }`}>
        <span className={active ? 'text-[#035433]' : 'text-gray-300'}>{icon}</span>
        {label}
      </div>
    </Link>
  );
}