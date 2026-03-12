'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChangePassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  const [realRole, setRealRole] = useState<string>(''); // 🚩 เก็บ Role จริงจาก API
  
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  // 🚩 ดึง Role จริงจาก API ทันทีที่เข้าหน้านี้ เพื่อความชัวร์
  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:8080/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const role = data.user.role.toUpperCase();
          setRealRole(role);
          // 🚩 อัปเดต localStorage ให้ตรงกับความจริงไปด้วยเลย
          localStorage.setItem('user_role', role);
        }
      } catch (err) {
        console.error("Fetch role error:", err);
      }
    };
    fetchRole();
  }, []);

  const handleBack = () => {
    // 🚩 ใช้ Role จาก State ที่ดึงมาจาก API (ถ้าไม่มีค่อยเอาจาก Storage)
    const role = realRole || localStorage.getItem('user_role')?.toUpperCase() || '';

    console.log("Redirecting based on role:", role);

    if (role === 'VENDOR') {
      router.replace('/merchantdashboard');
    } else if (role === 'STAFF') {
      router.replace('/staffdashboard');
    } else if (role === 'CUSTOMER') {
      router.replace('/wallethome');
    } else {
      router.replace('/'); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      alert("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    if (formData.new_password.length < 6) {
      alert("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/api/v1/users/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password
        })
      });

      if (response.ok) {
        alert("เปลี่ยนรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
        localStorage.clear();
        router.push('/');
      } else {
        const err = await response.json();
        alert(`ผิดพลาด: ${err.error || 'ไม่สามารถเปลี่ยนรหัสผ่านได้'}`);
      }
    } catch (e) {
      alert("ติดต่อ Server ไม่ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFB] font-sans">
      {/* Header */}
      <div className="flex items-center px-6 py-5 bg-white border-b border-gray-50 sticky top-0 z-30">
        <button onClick={handleBack} className="active:scale-90 transition-transform">
          <ChevronLeft className="text-[#035433]" size={24} strokeWidth={3} />
        </button>
        <h1 className="flex-1 text-center mr-6 font-black text-[#1a1c1e] text-lg uppercase tracking-tight">
          Security Settings
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-[#035433]">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Change Password</h2>
          <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Update your credentials to stay secure</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-2">Old Password</label>
            <div className="relative">
              <input 
                type={showPass.old ? "text" : "password"}
                required
                className="w-full bg-white border border-gray-100 py-4 px-12 rounded-2xl text-sm font-bold focus:border-[#035433] outline-none transition-all shadow-sm"
                value={formData.old_password}
                onChange={(e) => setFormData({...formData, old_password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPass({...showPass, old: !showPass.old})}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                {showPass.old ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-2">New Password</label>
            <div className="relative">
              <input 
                type={showPass.new ? "text" : "password"}
                required
                className="w-full bg-white border border-gray-100 py-4 px-12 rounded-2xl text-sm font-bold focus:border-[#035433] outline-none transition-all shadow-sm"
                value={formData.new_password}
                onChange={(e) => setFormData({...formData, new_password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPass({...showPass, new: !showPass.new})}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                {showPass.new ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-2">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showPass.confirm ? "text" : "password"}
                required
                className="w-full bg-white border border-gray-100 py-4 px-12 rounded-2xl text-sm font-bold focus:border-[#035433] outline-none transition-all shadow-sm"
                value={formData.confirm_password}
                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                {showPass.confirm ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#035433] text-white py-5 rounded-2xl font-black text-lg mt-8 shadow-[0_10px_30px_rgba(3,84,51,0.2)] uppercase tracking-[0.2em] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Update Password"}
          </button>
        </form>

        <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mt-12">
          Kasetsart University Food Court
        </p>
      </div>
    </div>
  );
}