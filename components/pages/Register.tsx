/* src/components/pages/Register.tsx */
'use client';

import React, { useState } from 'react';
import { Phone, Lock, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!phone || !password || !confirmPassword) {
      alert("กรุณากรอกข้อมูลให้ครบครับฟลุ๊ค!");
      return;
    }
    if (password !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกันครับ!");
      return;
    }
    alert("ลงทะเบียนสำเร็จแล้วครับ!");
  };

  return (
    <div className="flex-1 flex flex-col bg-white font-sans min-h-screen overflow-hidden">
      
      {/* 1. Top Image Section - ปรับความสูง h-32 เท่ากับหน้า Login */}
      <div className="relative h-32 w-full shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000" 
          alt="KU Building" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
      </div>

      <div className="px-8 -mt-4 relative z-10 flex-1 flex flex-col">
        {/* Title Section */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">KU Auth</h1>
          <p className="text-[9px] font-black text-gray-400 tracking-[0.2em]">
            Kasetsart University Digital Identity 
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 mb-4">
          <Link href="/" className="flex-1 py-3 text-sm font-black text-gray-300 text-center">
            Login
          </Link>
          <button className="flex-1 py-3 text-sm font-black text-[#006652] border-b-2 border-[#006652]">
            Sign Up
          </button>
        </div>

        {/* Input Fields - ปรับ Spacing (space-y-3) ให้เท่ากับหน้า Login */}
        <div className="space-y-3 flex-1">
          
          {/* Phone Number - ปรับความสูงช่อง py-3.5 */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number" 
                className="w-full bg-gray-50 border border-gray-100 py-3.5 pl-12 pr-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#006652]/10 transition-all"
              />
            </div>
          </div>

          {/* Password - ปรับความสูงช่อง py-3.5 */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full bg-gray-50 border border-gray-100 py-3.5 pl-12 pr-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#006652]/10 transition-all"
              />
            </div>
          </div>

          {/* Confirm Password - ปรับความสูงช่อง py-3.5 */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password" 
                className="w-full bg-gray-50 border border-gray-100 py-3.5 pl-12 pr-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#006652]/10 transition-all"
              />
            </div>
          </div>

          {/* Create Account Button - ปรับ py-4 */}
          <button 
            onClick={handleRegister}
            className="w-full bg-[#006652] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-900/10 active:scale-[0.98] mt-2 transition-all tracking-widest"
          >
            Create Account <ArrowRight size={16} />
          </button>

          {/* OR Divider - ระยะห่าง py-1.5 */}
          <div className="relative flex items-center py-1.5">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="mx-4 text-[9px] font-black text-gray-300">OR</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* Signup with Email Button - ปรับ py-3 */}
          <button className="w-full bg-white border-2 border-gray-100 text-gray-600 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all">
            <Mail size={16} /> Sign Up with Email
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center py-4 text-[10px] font-bold text-gray-400">
          Already have an account?{' '}
          <Link href="/" className="text-[#006652] font-black underline underline-offset-4 hover:opacity-70 transition-opacity">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
}