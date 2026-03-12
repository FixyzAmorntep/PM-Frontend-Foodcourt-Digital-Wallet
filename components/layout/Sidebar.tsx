/* src/components/layout/Sidebar.tsx */
'use client';

import { Home, History, Settings, LogOut, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);

  // 1. ดึงข้อมูล User จริงจาก Backend เมื่อ Sidebar เปิด
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token || !isOpen) return;

      try {
        const response = await fetch('http://localhost:8080/api/v1/wallet/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const result = await response.json();
          setUserData(result); // จะได้ข้อมูลพวก user_id และ balance มา
        }
      } catch (error) {
        console.error("Sidebar fetch error:", error);
      }
    };

    fetchUserData();
  }, [isOpen]);

  // 2. ฟังก์ชัน Logout แบบล้างบาง
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    
    onClose();
    router.push('/');
  };

  return (
    <>
      {/* Overlay พื้นหลัง */}
      <div 
        className={`absolute inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className={`absolute top-0 left-0 w-[280px] h-full bg-white z-50 transform transition-transform duration-300 ease-in-out font-sans ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header Section: แสดง User ID จากระบบจริง */}
        <div className="bg-[#035433] p-8 pt-12 rounded-br-[3rem] text-white flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-white/50 flex items-center justify-center overflow-hidden bg-white/10">
            <UserCircle size={40} className="text-white/80" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] opacity-70 font-black uppercase tracking-widest leading-none mb-1">
              Member ID
            </p>
            <p className="text-sm font-black tracking-tight truncate">
              {userData?.user_id || 'Connecting...'}
            </p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 mt-4 flex flex-col gap-2">
          <MenuLink 
            icon={<Home size={20}/>} 
            label="Home" 
            href="/wallethome" 
            active={pathname === '/wallethome'} 
            onClose={onClose} 
          />
          <MenuLink 
            icon={<History size={20}/>} 
            label="Transaction History" 
            href="/transactionhistory" 
            active={pathname === '/transactionhistory'} 
            onClose={onClose} 
          />
          <MenuLink 
            icon={<Settings size={20}/>} 
            label="Settings" 
            href="/settings" 
            active={pathname === '/settings'} 
            onClose={onClose} 
          />
        </nav>

        {/* Footer Section */}
        <div className="absolute bottom-10 left-0 w-full px-6 flex flex-col items-center gap-4">
          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-widest"
          >
            <LogOut size={20} /> Logout
          </button>
          <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em]">
            KU Food Court Digital v2.6.0
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