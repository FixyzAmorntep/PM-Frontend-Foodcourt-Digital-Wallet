'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock, ShieldCheck } from 'lucide-react';

export default function ChangePasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert("รหัสผ่านใหม่ไม่ตรงกัน");
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/v1/admin/change-password', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
      });

      if (res.ok) {
        alert("เปลี่ยนรหัสผ่านสำเร็จ!");
        localStorage.clear();            
        onClose();                       
        window.location.href = '/admin-portal/login';
      } else {
        const err = await res.json();
        alert(err.error || "มีบางอย่างผิดพลาด");
      }
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b flex justify-between items-center">
          <div className="text-left">
            <h3 className="text-lg font-black uppercase italic italic">Security Settings</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update your admin credentials</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-500"><X size={24} /></button>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2"><Lock size={12}/> Current Password</label>
            <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full bg-[#F8FAFB] px-4 py-3 rounded-xl border border-slate-200 text-sm font-black outline-none focus:border-[#006D5B] transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#006D5B] uppercase ml-2 flex items-center gap-2"><ShieldCheck size={12}/> New Password</label>
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#F8FAFB] px-4 py-3 rounded-xl border border-slate-200 text-sm font-black outline-none focus:border-[#006D5B] transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#006D5B] uppercase ml-2 flex items-center gap-2"><ShieldCheck size={12}/> Confirm New Password</label>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-[#F8FAFB] px-4 py-3 rounded-xl border border-slate-200 text-sm font-black outline-none focus:border-[#006D5B] transition-all" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black text-black font-black py-4 rounded-2xl shadow-lg hover:bg-slate-800 transition-all uppercase tracking-widest text-xs mt-4">
            {loading ? 'Processing...' : 'Confirm Update'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}