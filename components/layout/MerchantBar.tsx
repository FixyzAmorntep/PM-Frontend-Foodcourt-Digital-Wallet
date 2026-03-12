/* src/components/layout/MerchantBar.tsx */
'use client';

import { Home, History, Settings, LogOut, UserCircle, Store, FileText } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MerchantBar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState<string>('PaJong'); // ✨ Default เป็นชื่อร้านป้าจง

  useEffect(() => {
    if (isOpen) {
      // ✨ ดึงชื่อจาก localStorage (หรือ fallback เป็นชื่อร้าน)
      const savedName = localStorage.getItem('userName');
      if (savedName && savedName.length < 30) {
        setDisplayName(savedName);
      }
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPhone'); 
    
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
        
        {/* Header Section: UI เดิมเป๊ะ เปลี่ยนแค่ displayName */}
        <div className="bg-[#035433] p-8 pt-12 rounded-br-[3rem] text-white flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-white/50 flex items-center justify-center overflow-hidden bg-white/10">
            <Store size={32} className="text-white/80" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] opacity-70 font-black uppercase tracking-widest leading-none mb-1">
              Merchant Account
            </p>
            <p className="text-sm font-black tracking-tight truncate">
              {displayName}
            </p>
          </div>
        </div>

        <nav className="p-4 mt-6 flex flex-col gap-2">
          <MenuLink 
            icon={<Home size={20}/>} 
            label="Home Dashboard" 
            href="/merchantdashboard" 
            active={pathname === '/merchantdashboard'} 
            onClose={onClose} 
          />
          <MenuLink 
            icon={<FileText size={20}/>} 
            label="Past Sales" 
            href="/merchantpastsale" 
            active={pathname === '/merchantpastsale'} 
            onClose={onClose} 
          />
          <MenuLink 
            icon={<History size={20}/>} 
            label="Activity History" 
            href="/merchantactivity" 
            active={pathname === '/merchantactivity'} 
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

        <div className="absolute bottom-10 left-0 w-full px-6 flex flex-col items-center gap-4">
          <button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-widest">
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
      <div className={`flex items-center gap-4 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 ${
        active 
          ? 'bg-[#E0ECEE] text-[#006064] shadow-sm' 
          : 'text-gray-400 hover:bg-gray-50'
      }`}>
        <span className={active ? 'text-[#006064]' : 'text-gray-300'}>{icon}</span>
        {label}
      </div>
    </Link>
  );
}