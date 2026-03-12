'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; 
import { X, Store, User, Phone, Tag } from 'lucide-react';

interface StallFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any; 
}

export default function StallFormModal({ isOpen, onClose, onSave, initialData }: StallFormModalProps) {
  const [formData, setFormData] = useState({
    stall_name: '',
    owner_name: '',
    phone: '',
    category: 'General Food'
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (initialData && isOpen) {
      setFormData({
        stall_name: initialData.stall_name || initialData.StallName || '',
        owner_name: initialData.owner_name || initialData.OwnerName || '',
        phone: initialData.phone || initialData.Phone || '',
        category: initialData.category || initialData.Category || 'General Food'
      });
    } else if (isOpen) {
      setFormData({ stall_name: '', owner_name: '', phone: '', category: 'General Food' });
    }
    return () => setMounted(false);
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    // 🚩 ใช้ Inline Style ตามแบบ GPModal เพื่อบังคับให้อยู่กลางจอและลอยทับทุกอย่าง
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 99999, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px', 
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)' // แถมเบลอหลังให้ด้วยตามที่ต้องการครับ
    }}>
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        <div className="px-8 pt-8 flex justify-between items-center text-slate-800">
          <div className="text-left">
            <h3 className="text-[18px] font-black uppercase tracking-tight italic">
              {initialData ? 'Edit Restaurant' : 'Register New Shop'}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Establishment Details</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-500 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="px-8 py-6 space-y-4">
          {/* Shop Name */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-black text-[#006D5B] uppercase ml-2 flex items-center gap-2"><Store size={12}/> Shop Name</label>
            <input 
              type="text" 
              value={formData.stall_name} 
              onChange={(e) => setFormData({...formData, stall_name: e.target.value})}
              className="w-full bg-[#F8FAFB] px-4 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-700 outline-none focus:border-[#006D5B] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Owner */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black text-[#006D5B] uppercase ml-2 flex items-center gap-2"><User size={12}/> Owner</label>
              <input 
                type="text" 
                value={formData.owner_name} 
                onChange={(e) => setFormData({...formData, owner_name: e.target.value})}
                className="w-full bg-[#F8FAFB] px-4 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-700 outline-none focus:border-[#006D5B] transition-all"
              />
            </div>
            {/* Phone */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black text-[#006D5B] uppercase ml-2 flex items-center gap-2"><Phone size={12}/> Phone</label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-[#F8FAFB] px-4 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-700 outline-none focus:border-[#006D5B] transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-black text-[#006D5B] uppercase ml-2 flex items-center gap-2"><Tag size={12}/> Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-[#F8FAFB] px-4 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-700 outline-none focus:border-[#006D5B] transition-all cursor-pointer"
            >
              <option>General Food</option>
              <option>Noodles</option>
              <option>Drinks</option>
              <option>Desserts</option>
            </select>
          </div>
        </div>
        
        <div className="px-8 pb-12 flex flex-col gap-4">
          <button 
            onClick={() => onSave(formData)} 
            className="w-full text-center font-bold text-slate-700 hover:text-black transition-all text-[16px] uppercase tracking-widest bg-slate-50 py-4 rounded-2xl shadow-sm"
          >
            {initialData ? 'Save Changes' : 'Create Shop'}
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