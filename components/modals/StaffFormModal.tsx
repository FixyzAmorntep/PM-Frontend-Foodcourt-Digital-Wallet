'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; 
import { X, User, Phone, ShieldCheck } from 'lucide-react';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any; 
}

export default function StaffFormModal({ isOpen, onClose, onSave, initialData }: StaffFormModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (initialData && isOpen) {
      setFormData({
        full_name: initialData.full_name || initialData.FullName || '',
        phone: initialData.phone || initialData.Phone || ''
      });
    } else if (isOpen) {
      setFormData({ full_name: '', phone: '' });
    }
    return () => setMounted(false);
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = () => {
    if (!formData.full_name) return alert("โปรดกรอกชื่อพนักงาน");
    // ส่งข้อมูลออกไปให้ handleSaveStaff ใน Dashboard
    onSave(formData);
  };

  return createPortal(
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 99999, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px', 
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        <div className="px-8 pt-8 flex justify-between items-center text-slate-800">
          <div className="text-left">
            <h3 className="text-[18px] font-black uppercase tracking-tight italic">
              {initialData ? 'Edit Staff Member' : 'Register New Staff'}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personnel Details</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-500 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="px-8 py-6 space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-black text-[#006D5B] uppercase ml-2 flex items-center gap-2">
              <User size={12}/> Full Name
            </label>
            <input 
              autoFocus
              type="text" 
              value={formData.full_name} 
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="w-full bg-[#F8FAFB] px-4 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-700 outline-none focus:border-[#006D5B] transition-all"
              placeholder="Enter name and surname..."
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-black text-[#006D5B] uppercase ml-2 flex items-center gap-2">
              <Phone size={12}/> Phone Number
            </label>
            <input 
              type="text" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-[#F8FAFB] px-4 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-700 outline-none focus:border-[#006D5B] transition-all"
              placeholder="08x-xxx-xxxx"
            />
          </div>

          {/* 🚩 Default Password Hint (Only show on Create) */}
          {!initialData && (
            <div className="bg-emerald-50/50 p-4 rounded-2xl flex items-start gap-3 border border-emerald-100/50">
              <ShieldCheck className="text-[#006D5B] shrink-0" size={16} />
              <div className="text-left">
                <p className="text-[10px] font-black text-[#006D5B] uppercase tracking-wider">Default Security</p>
                <p className="text-[11px] font-bold text-slate-500">Initial password is set to <span className="text-[#006D5B] font-black underline">password</span></p>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-8 pb-12 flex flex-col gap-4">
          <button 
            onClick={handleSubmit} 
            className="w-full text-center font-bold text-slate-700 hover:text-black transition-all text-[16px] uppercase tracking-widest bg-slate-50 py-4 rounded-2xl shadow-sm"
          >
            {initialData ? 'Update Information' : 'Confirm Registration'}
          </button>
          
          <button onClick={onClose} className="w-full text-center font-bold text-slate-300 hover:text-slate-500 transition-all text-[11px] uppercase tracking-widest">
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}