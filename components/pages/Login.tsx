/* src/components/pages/Login.tsx */
'use client';

import React, { useState } from 'react';
import { Phone, Lock, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_USERS } from '@/lib/mockData';

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = MOCK_USERS.find(
      (u) => u.phone === phone && u.password === password
    );

    if (user) {
      // 1. เก็บข้อมูล Session ปัจจุบัน
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userPhone', user.phone); // เก็บเบอร์ไว้แยกกระเป๋าเงิน

      // 2. จัดการยอดเงินแยกตาม Account (Persistent Data)
      const userBalanceKey = `balance_${user.phone}`;
      const savedBalance = localStorage.getItem(userBalanceKey);
      
      // ตรวจสอบ: ถ้าเครื่องนี้ไม่เคยมีเงินของเบอร์นี้มาก่อนเลย ให้เอาจาก MockData ไปใส่ครั้งแรก
      if (savedBalance === null) {
        localStorage.setItem(userBalanceKey, (user.balance ?? 0).toString());
      }

      if (user.role === 'customer') {
        router.push('/wallethome');
      } else if (user.role === 'merchant') {
        router.push('/merchant-dashboard');
      }
    } else {
      setError('เบอร์โทรศัพท์หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white font-sans min-h-screen overflow-hidden">
      <div className="relative h-32 w-full">
        <img src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000" alt="KU" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
      </div>
      <div className="px-8 -mt-4 relative z-10 flex-1 flex flex-col">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">KU Auth</h1>
          <p className="text-[9px] font-black text-gray-400 tracking-[0.2em]">Kasetsart University Digital Identity </p>
        </div>
        <div className="flex border-b border-gray-100 mb-4">
          <button className="flex-1 py-3 text-sm font-black text-[#006652] border-b-2 border-[#006652]">Login</button>
          <Link href="/register" className="flex-1 py-3 text-sm font-black text-gray-300 text-center">Sign Up</Link>
        </div>
        <form onSubmit={handleLogin} className="space-y-3 flex-1">
          {error && <div className="bg-red-50 text-red-500 text-[10px] py-2 px-3 rounded-lg font-bold text-center border border-red-100 italic">* {error}</div>}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full bg-gray-50 border border-gray-100 py-3.5 pl-12 pr-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#006652]/10 transition-all" required />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Password</label>
              <button type="button" className="text-[9px] font-black text-[#006652] uppercase font-sans">Forgot?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-gray-50 border border-gray-100 py-3.5 pl-12 pr-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#006652]/10 transition-all" required />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#006652] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-900/10 active:scale-[0.98] mt-2 transition-all">Login <ArrowRight size={16} /></button>
          {/* OR Divider - ส่วนแบ่งตัวเลือก */}
          <div className="relative flex items-center py-1.5">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="mx-4 text-[9px] font-black text-gray-300 uppercase">OR</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>
          <button type="button" className="w-full bg-white border-2 border-gray-100 text-gray-600 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 mt-4"><Mail size={16} /> Login with Email</button>
        </form>
        {/* Footer Link */}
        <p className="text-center py-4 text-[10px] font-bold text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#006652] font-black underline underline-offset-4 hover:opacity-70 transition-opacity">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}