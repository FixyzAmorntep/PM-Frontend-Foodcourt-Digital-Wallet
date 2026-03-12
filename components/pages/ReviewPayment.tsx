'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ShieldCheck, Wallet, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ReviewPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 🚀 ดึงค่าทุกอย่างจาก URL มาแบบ Dynamic
  const merchantPublicId = searchParams.get('merchantId') || 'P001';
  const stallId = searchParams.get('stallId') || 'stall-001';
  const merchantName = searchParams.get('merchantName') || 'ร้านค้าในโรงอาหาร';
  const amountFromUrl = searchParams.get('amount') || '0'; // ดึงราคาจาก URL

  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const amountToPay = parseFloat(amountFromUrl);

  // 1. ดึงยอดเงินปัจจุบันจาก Backend
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:8080/api/v1/wallet/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          setCurrentBalance(result.balance);
        }
      } catch (error) {
        console.error("Fetch balance error:", error);
      }
    };
    fetchBalance();
  }, []);

  // 2. ฟังก์ชันยืนยันการจ่ายเงิน
  const handleConfirm = async () => {
    if (amountToPay <= 0) {
        alert("ยอดเงินไม่ถูกต้อง");
        return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/api/v1/wallet/pay', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver_public_id: merchantPublicId,
          stall_id: stallId,
          amount: amountToPay // 🚀 ใช้ยอดเงินที่ส่งมาจาก URL
        })
      });

      if (response.ok) {
        const result = await response.json();
        // ส่งต่อไปหน้า Success พร้อมข้อมูลจริง
        router.push(`/paymentsuccess?amount=${amountToPay}&merchant=${merchantName}&txnId=${result.transaction_id || ''}`);
      } else {
        const errData = await response.json();
        alert(`จ่ายเงินไม่สำเร็จ: ${errData.error || "ตรวจสอบระบบ Backend"}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("ไม่สามารถเชื่อมต่อ Server ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFB] h-full font-sans">
      <div className="flex justify-between items-center px-6 py-6 bg-white border-b border-gray-100 sticky top-0 z-20">
        <Link href="/scanpay">
          <ChevronLeft className="text-gray-400 active:scale-90 transition-transform" size={24} />
        </Link>
        <h1 className="text-lg font-black text-[#035433] uppercase tracking-tight">Payment Review</h1>
        <div className="w-6" />
      </div>

      <div className="p-6 flex-1 flex flex-col font-sans">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#035433]">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-tight">{merchantName}</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Stall ID: {stallId}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Method</span>
            <div className="flex items-center gap-2 text-[#035433] font-black text-[10px] bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
              <Wallet size={12} /> KU Wallet
            </div>
          </div>
          <div className="h-px bg-gray-50 w-full mb-6" />
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
            <div className="flex items-baseline gap-1 text-[#035433]">
              <span className="text-2xl font-bold">฿</span>
              <span className="text-4xl font-black tracking-tighter">
                {amountToPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-dashed border-gray-100 flex justify-between items-center">
            <span className="text-[9px] font-bold text-gray-300 uppercase">Your Balance</span>
            <span className="text-[10px] font-black text-gray-400 italic">
              ฿{currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="mt-auto space-y-4 pt-8">
          <button 
            onClick={handleConfirm}
            disabled={loading || currentBalance < amountToPay}
            className={`w-full ${loading || currentBalance < amountToPay ? 'bg-gray-300' : 'bg-[#00E676] active:scale-[0.97]'} text-[#023b24] py-5 rounded-2xl font-black text-lg transition-all uppercase tracking-[0.15em]`}
          >
            {loading ? 'Processing...' : currentBalance < amountToPay ? 'Insufficient Balance' : 'Confirm Payment'}
          </button>
          
          <Link href="/scanpay" className="block text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-600 transition-colors">
            Cancel Transaction
          </Link>
          
          <div className="flex items-center justify-center gap-2 text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em] pt-4">
            <ShieldCheck size={14} /> Secure Encrypted Transaction
          </div>
        </div>
      </div>
    </div>
  );
}