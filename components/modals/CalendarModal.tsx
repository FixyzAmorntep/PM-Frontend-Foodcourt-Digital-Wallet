'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; 
import { X, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

export default function CalendarModal({ isOpen, onClose, startDate, endDate, onSave }: any) {
  // 🚩 พักข้อมูลวันที่เริ่มและวันที่จบ
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      setTempStart(startDate);
      setTempEnd(endDate);
    }
    return () => setMounted(false);
  }, [isOpen, startDate, endDate]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-[380px] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        <div className="px-8 pt-8 flex justify-between items-center text-slate-800">
          <h3 className="text-[18px] font-black uppercase tracking-tight italic">Select Date Range</h3>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-500"><X size={20} /></button>
        </div>
        
        <div className="px-8 py-6 space-y-4">
          <div className="flex flex-col gap-4 bg-[#F8FAFB] rounded-[1.5rem] p-6 border border-slate-100 shadow-inner">
            
            {/* วันที่เริ่มต้น */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Date</label>
              <input 
                type="date" 
                value={tempStart}
                onChange={(e) => setTempStart(e.target.value)}
                className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 text-sm font-black text-[#006D5B] outline-none"
              />
            </div>

            <div className="flex justify-center text-slate-300">
              <ArrowRight size={20} />
            </div>

            {/* วันที่สิ้นสุด */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Date</label>
              <input 
                type="date" 
                value={tempEnd}
                min={tempStart} // 🚩 ดักไม่ให้เลือกวันจบก่อนวันเริ่ม
                onChange={(e) => setTempEnd(e.target.value)}
                className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 text-sm font-black text-[#006D5B] outline-none"
              />
            </div>
          </div>
        </div>
        
        <div className="px-8 pb-12 flex flex-col gap-4">
          <button 
            onClick={() => onSave(tempStart, tempEnd)} // 🚩 ส่งช่วงวันที่กลับไป
            className="w-full text-center font-bold text-slate-400 hover:text-slate-600 transition-all text-[16px] uppercase tracking-widest"
          >
            Apply Range
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