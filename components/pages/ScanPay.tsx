'use client';

import { ChevronLeft, HelpCircle, Flashlight, QrCode, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function ScanPay() {
  return (
    <div className="flex-1 flex flex-col bg-[#121212] relative overflow-hidden">
      
      {/* 1. Top Navigation Bar */}
      <div className="flex justify-between items-center px-6 py-6 sticky top-0 z-30 bg-gradient-to-b from-black/50 to-transparent">
        <Link href="/wallethome">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center text-white active:scale-90 transition-all border border-white/10">
            <ChevronLeft size={24} />
          </div>
        </Link>
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-white font-bold text-lg tracking-tight leading-none">Scan to Pay</h1>
          <div className="bg-white px-3 py-[2px] rounded-full flex items-center justify-center min-w-[90px]">
            <span className="text-[9px] font-black text-[#035433] uppercase tracking-[0.1em] text-center">
              KU FOOD COURT
            </span>
          </div>
        </div>
        <div className="w-10 h-10 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center text-white/80 border border-white/10">
          <HelpCircle size={22} />
        </div>
      </div>

      {/* 2. Main Scanner Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative -mt-10">
        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl z-20 mb-8 border border-white/20 text-center max-w-[240px]">
          <p className="text-[#035433] font-black text-[11px] uppercase tracking-tighter">Scan Merchant QR</p>
          <p className="text-[#035433]/70 text-[9px] font-medium leading-tight">Align the code within the frame</p>
        </div>

        {/* 🚀 Scanner Frame - แก้ไขให้กดเพื่อจำลองการสแกนร้านป้าใจ */}
        <Link 
          href="/reviewpayment?merchantId=P001&stallId=pajong-stall-001&merchantName=Pajong Kitchen&amount=55.00" 
          className="relative z-20 w-64 h-64 active:scale-95 transition-all group"
        >
          <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-[#00E676] rounded-tl-2xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-[#00E676] rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-[#00E676] rounded-bl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-[#00E676] rounded-br-2xl"></div>
          
          {/* เส้นวิ่งสแกนแบบมีแอนิเมชัน */}
          <div className="w-full h-[2px] bg-[#00E676] absolute top-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(0,230,118,0.8)] animate-pulse"></div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-white text-[10px] font-bold bg-[#00E676]/20 px-4 py-2 rounded-full backdrop-blur-md border border-[#00E676]/30">
               Tap to Pay Merchant-001
             </span>
          </div>
        </Link>

        <div className="z-20 mt-10 text-center space-y-2 px-10">
          <p className="text-white/60 text-[10px] font-medium leading-tight">Position the QR code within the frame to pay.</p>
          
          <Link href="/reviewpayment?merchantId=merchant-001" className="block active:opacity-50 transition-opacity">
            <span className="text-[#00E676] text-[10px] font-bold underline underline-offset-4 decoration-[#00E676]/30">
              Can&apos;t scan? Enter Merchant ID manually
            </span>
          </Link>
        </div>
      </div>

      {/* 3. Bottom Actions Card */}
      <div className="px-6 pb-12 z-30">
        <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/10 flex justify-between items-center max-w-sm mx-auto shadow-2xl">
          <ActionItem icon={<Flashlight size={20} />} label="Flashlight" />
          <ActionItem icon={<QrCode size={28} />} label="Scanning" active />
          <ActionItem icon={<ImageIcon size={20} />} label="Gallery" />
        </div>
      </div>
    </div>
  );
}

function ActionItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <button className={`flex items-center justify-center rounded-full active:scale-90 transition-all shadow-lg ${
        active 
        ? 'w-16 h-16 bg-[#00695C] text-white border-4 border-[#004D40] shadow-teal-900/30' 
        : 'w-12 h-12 bg-white text-gray-800'
      }`}>
        {icon}
      </button>
      <span className={`text-[9px] font-bold uppercase tracking-widest ${active ? 'text-[#00E676]' : 'text-white/60'}`}>
        {label}
      </span>
    </div>
  );
}