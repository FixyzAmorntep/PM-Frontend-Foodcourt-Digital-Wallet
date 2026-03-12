/* src/components/pages/CashRefund.tsx */
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Banknote, Info, QrCode } from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react'; 

export default function CashRefund() {
  const [activeTab, setActiveTab] = useState<'topup' | 'refund'>('topup');
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:8080/api/v1/wallet/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setWalletInfo(data);
        }
      } catch (error) {
        console.error("Fetch wallet error:", error);
      }
    };
    fetchWallet();
  }, []);

  // ฟังก์ชันสำหรับ Refund ปกติ (ผ่านระบบพนักงาน)
  const handleInitiateRefund = async () => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      alert("กรุณาระบุจำนวนเงินที่ต้องการแลกคืน");
      return;
    }
    
    if (parseFloat(refundAmount) > (walletInfo?.balance || 0)) {
      alert("ยอดเงินในวอลเล็ทไม่เพียงพอ");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/api/v1/wallet/refund/initiate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: parseFloat(refundAmount) })
      });
      
      if (response.ok) {
        alert("สร้างคำขอสำเร็จ! โปรดรับเงินสดที่เคาน์เตอร์ภายใน 15 นาที");
        setRefundAmount('');
        window.location.reload(); 
      } else {
        const err = await response.json();
        alert(`ผิดพลาด: ${err.error}`);
      }
    } catch (e) {
      alert("ติดต่อ Server ไม่ได้");
    } finally {
      setLoading(false);
    }
  };

  // ⚡ ฟังก์ชันสำหรับ Admin Bypass (หักเงินทันที)
  const handleBypassRefund = async () => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) return;
    if (!confirm("Dev Mode: ยืนยันการถอนเงินทันทีโดยไม่ผ่านพนักงาน?")) return;

    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/api/v1/wallet/refund/bypass', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: parseFloat(refundAmount) })
      });
      
      if (response.ok) {
        alert("Bypass สำเร็จ! หักเงินเรียบร้อย");
        window.location.reload(); 
      } else {
        const err = await response.json();
        alert(`Bypass ผิดพลาด: ${err.error}`);
      }
    } catch (e) {
      alert("ติดต่อ Server ไม่ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFB] font-sans h-full">
      <div className="bg-white px-6 pt-5 pb-2 shadow-sm sticky top-0 z-30">
        <div className="flex items-center mb-6">
          <Link href="/wallethome">
            <ChevronLeft className="text-[#035433]" size={24} strokeWidth={3} />
          </Link>
          <h1 className="flex-1 text-center mr-6 font-black text-[#1a1c1e] text-xl tracking-tight uppercase">
            Counter Service
          </h1>
        </div>
        
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('topup')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'topup' ? 'bg-white text-[#035433] shadow-sm' : 'text-gray-400'
            }`}
          >
            Cash Top-up
          </button>
          <button 
            onClick={() => setActiveTab('refund')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'refund' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400'
            }`}
          >
            Refund
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        {activeTab === 'topup' && (
          <div className="flex flex-col items-center space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 w-full flex flex-col items-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Show to Staff</p>
              <div className="bg-white p-4 rounded-3xl border-4 border-[#035433]/10">
                {walletInfo?.public_id ? (
                  <QRCodeSVG value={walletInfo.public_id} size={220} />
                ) : (
                  <div className="w-[220px] h-[220px] bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center">
                    <QrCode className="text-gray-200" size={60} />
                  </div>
                )}
              </div>
              <div className="mt-8 text-center bg-gray-50 px-6 py-3 rounded-2xl w-full">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Public Wallet ID</p>
                <p className="text-sm font-black text-[#035433] mt-1 tracking-widest truncate">
                  {walletInfo?.public_id || 'Generating...'}
                </p>
              </div>
            </div>
            <div className="flex gap-4 bg-green-50 p-5 rounded-3xl border border-green-100">
              <Info className="text-[#035433] shrink-0" size={20} />
              <p className="text-[11px] font-bold text-[#035433]/70 leading-relaxed uppercase">
                ให้พนักงานสแกน QR นี้เพื่อเติมเงินสดเข้าบัญชีของคุณ
              </p>
            </div>
          </div>
        )}

        {activeTab === 'refund' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm">
                <Banknote size={24} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none mb-1">Available Balance</p>
                <p className="text-2xl font-black text-red-700">฿{walletInfo?.balance?.toLocaleString() || '0.00'}</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100 text-center space-y-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Refund Amount</p>
              <input 
                type="number" 
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-5xl font-black text-center bg-transparent outline-none text-[#1a1c1e] placeholder:text-gray-100"
              />
              <div className="w-20 h-1.5 bg-red-500 mx-auto rounded-full" />
              <p className="text-[10px] font-black text-gray-300 uppercase px-4 leading-relaxed tracking-tighter">
                Money will be frozen immediately for cash collection at the counter.
              </p>
            </div>

            <button 
              onClick={handleInitiateRefund}
              disabled={loading || !refundAmount}
              className="w-full py-5 rounded-2xl font-black text-lg shadow-lg uppercase tracking-widest transition-all active:scale-[0.98]"
              style={{ 
                backgroundColor: '#d63c3c', 
                color: '#000000', 
                opacity: 1 
              }}
            >
              {loading ? "Processing..." : "Initiate Refund"}
            </button>

            <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
              Kasetsart University Food Court
            </p>

            {/* ⚡ ปุ่ม Bypass ลับ ด้านล่างสุด */}
            <div className="mt-auto pt-10 pb-2">
              <button 
                onClick={handleBypassRefund}
                className="block mx-auto text-[8px] text-gray-300 hover:text-red-400 uppercase tracking-tighter opacity-20 hover:opacity-100 transition-all font-bold"
              >
                [ Admin: Dev Bypass Refund ]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}