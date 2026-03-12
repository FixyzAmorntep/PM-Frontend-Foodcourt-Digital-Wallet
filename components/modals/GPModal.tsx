'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; 
import { X } from 'lucide-react';

export default function GPModal({ isOpen, onClose, value, onSave }: any) {
  // 🚩 1. สร้าง State พักข้อมูล (tempValue) เพื่อไม่ให้ไปยุ่งกับค่าข้างนอกทันที
  const [tempValue, setTempValue] = useState(value);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 🚩 2. ทุกครั้งที่เปิด Modal ให้ Reset ค่าที่พักไว้ให้เท่ากับค่าจริงล่าสุด
    if (isOpen) setTempValue(value); 
    return () => setMounted(false);
  }, [isOpen, value]);

  // 🚩 3. ปรับฟังก์ชันให้แก้เฉพาะค่าที่พักไว้ (tempValue)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val > 100) val = 100;
    if (val < 0) val = 0;
    setTempValue(val); // แก้เฉพาะในนี้ ข้างหลังตารางจะยังไม่ขยับ
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="relative bg-white rounded-[2.5rem] w-2/3 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="px-8 pt-8 flex justify-between items-center text-slate-800">
          <h3 className="text-[18px] font-black uppercase tracking-tight italic">Edit %GP</h3>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-500"><X size={20} /></button>
        </div>
        
        <div className="px-8 py-6">
          <p className="text-[11px] text-[#4F7A73] font-bold uppercase mb-4">Gross Profit Percentage (0-100%)</p>
          <div className="bg-[#F8FAFB] rounded-[1.5rem] py-10 flex items-center justify-center gap-2 border border-slate-100">
            <input 
              type="number" 
              value={tempValue} // 🚩 ใช้ค่าที่พักไว้
              onChange={handleInputChange} 
              min="0" max="100"
              className="bg-transparent text-6xl font-black text-[#006D5B] w-24 text-center outline-none border-none focus:ring-0"
              autoFocus
            />
            <span className="text-2xl font-black text-[#006D5B]/10">%</span>
          </div>
        </div>
        
        <div className="px-8 pb-12 flex flex-col gap-4">
          <button 
            onClick={() => onSave(tempValue)} // 🚩 4. ส่งค่าที่พักไว้กลับไปตอนกด Save เท่านั้น
            className="w-full text-center font-bold text-slate-400 hover:text-slate-600 transition-all text-[16px] uppercase tracking-widest"
          >
            Save Changes
          </button>
          
          <button onClick={onClose} className="w-full text-center font-bold text-slate-400 hover:text-slate-600 transition-all text-[11px] uppercase tracking-widest">
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}