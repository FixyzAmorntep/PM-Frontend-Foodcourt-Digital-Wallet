'use client';

import React, { useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ phone: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // 🚀 ปรับ Logic ให้ส่ง email: "" ตามที่ Backend คาดหวังเหมือนโค้ด Login ปกติ
      const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
          email: "" // 🚩 ห้ามลืมตัวนี้ เพราะ Go คาดหวังฟิลด์นี้ตาม LoginRequest struct
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // เช็ค Role ว่าเป็น ADMIN หรือ STAFF ตามเงื่อนไขของระบบแอดมิน
        const role = data.user.role.toUpperCase();
        if (role !== 'ADMIN' && role !== 'STAFF') {
          alert("Access Denied: บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบดูแลจัดการ");
          setLoading(false);
          return;
        }

        // เก็บข้อมูลลง LocalStorage ตามมาตรฐานเดิมของฟลุ๊ค
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_role', data.user.role);
        localStorage.setItem('userName', data.user.full_name);
        localStorage.setItem('userPhone', data.user.phone);

        // นำทางไปหน้า Dashboard ของแอดมิน
        router.push('/admin-portal/dashboard');
      } else {
        // ดึง Error Message จาก Backend มาแสดง (เช่น Invalid Credentials)
        alert(data.error || "Login Failed: โปรดเช็คเบอร์โทรศัพท์หรือรหัสผ่าน");
      }
    } catch (err) {
      console.error("Admin Login Error:", err);
      alert("Cannot connect to server: เช็คว่ารัน Backend หรือเชื่อมต่อเน็ตอยู่ไหม");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center font-sans p-6">
      <div className="w-400px max-w-[360px] bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8 space-y-7 transition-all">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-800 border border-slate-100">
            <ShieldCheck size={36} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-[900] text-slate-900 tracking-tight leading-none">ADMIN PORTAL</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Authorized Only</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number / ID</label>
            <input 
              type="text"
              required
              className="w-full bg-slate-50 border-2 border-slate-50 py-3.5 px-6 rounded-xl font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-800"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Password</label>
            <input 
              type="password"
              required
              className="w-full bg-slate-50 border-2 border-slate-50 py-3.5 px-6 rounded-xl font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-800"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white border-2 border-slate-900 text-slate-900 py-4 rounded-xl font-black text-base hover:bg-slate-950 hover:text-white active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest mt-2 group"
          >
            {loading ? "Verifying..." : "Enter System"}
            <ArrowRight size={18} className="text-slate-900 group-hover:translate-x-1 group-hover:text-white transition-all" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.3em] opacity-60">
            KU Food Court Digital v2.6.0
          </p>
        </div>
      </div>
    </div>
  );
}