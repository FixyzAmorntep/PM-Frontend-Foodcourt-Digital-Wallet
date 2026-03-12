'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Check, RefreshCw } from 'lucide-react';

const MOCK_QR_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg';

export default function ReceivePaymentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Input, 2: QR, 3: Success
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 🚩 เปลี่ยน stall_id ให้ตรงกับ ID ในตาราง food_stalls ของฟลุ๊ค
  const STALL_ID = "YOUR_STALL_ID_HERE"; 

  const [merchantData, setMerchantData] = useState({
    name: "PaJong",
    balance: 0
  });

  // ดึงข้อมูลร้านค้าตอนโหลดหน้าแรก
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (data.user) {
          setMerchantData({ name: data.user.full_name, balance: data.user.balance });
        }
      } catch (err) { console.error("Fetch profile failed", err); }
    };
    fetchProfile();
  }, []);

  // 🚩 ฟังก์ชันยิง API ไปหา Go (Simulate Payment)
  const handleSimulatePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/payments/simulate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      if (response.ok) {
        // 🚩 เพิ่มตรงนี้: ดึงยอดเงินล่าสุดมาอัปเดตหน้าจอ
        const res = await fetch('http://localhost:8080/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (data.user) {
          setMerchantData({ name: data.user.full_name, balance: data.user.balance });
        }

        setStep(3); // ค่อยเปลี่ยนไปหน้า Success
      } else {
        const err = await response.json();
        alert(`ผิดพลาด: ${err.message || 'ระบบปฏิเสธการจ่ายเงิน'}`);
      }
    } catch (err) {
      alert("เชื่อมต่อ Backend ไม่ได้");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] max-w-md mx-auto font-sans text-[#1A1C1E]">
      
      {/* Header */}
      {step !== 3 && (
        <header className="px-6 py-4 bg-white flex items-center justify-between sticky top-0 z-10 border-b border-gray-50">
          <div className="flex items-center gap-4">
            <button onClick={() => step === 1 ? router.back() : setStep(1)}>
              <ArrowLeft className="text-gray-700" size={22} />
            </button>
            <h1 className="text-[17px] font-black tracking-tight text-gray-700">Seller Home</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] font-black text-[#006064] leading-tight">{merchantData.name}</p>
              <p className="text-[13px] font-black text-[#006064]">฿{merchantData.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-10 h-10 bg-[#E0ECEE] rounded-full flex items-center justify-center text-[#006064]">
              <User size={20} fill="currentColor" />
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col p-6">
        {step === 1 && (
          <div className="space-y-8 flex-1 flex flex-col pt-4">
            <div className="space-y-4">
              <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount to Charge</p>
              <div className="flex items-center bg-white border-2 border-gray-100 rounded-[1.5rem] py-6 px-6 shadow-sm focus-within:border-[#006064]">
                <span className="text-3xl font-black text-[#006064] mr-3">฿</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-4xl font-black text-[#006064] focus:outline-none text-right"
                />
              </div>
            </div>
            <button
              disabled={!amount || parseFloat(amount) <= 0}
              onClick={() => setStep(2)}
              className="mt-auto w-full bg-[#00695C] text-white py-5 rounded-[1.2rem] font-black text-lg uppercase shadow-lg active:scale-95 transition-all mb-4"
            >
              Confirm
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 flex-1 flex flex-col items-center justify-center text-center">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-[#006064] uppercase tracking-widest">Scan to Pay</h2>
              <p className="text-sm font-medium text-gray-400">Customer should scan this code from their app</p>
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50">
              <div className="w-64 h-64 border-2 border-dashed border-gray-100 rounded-3xl flex items-center justify-center bg-[#F0F7F7] overflow-hidden">
                <img src={MOCK_QR_IMAGE} alt="QR Code" className="w-52 h-52 object-contain" />
              </div>
            </div>
            <div className="bg-[#E0F2F1] py-3 px-8 rounded-full border border-[#B2DFDB]">
              <span className="text-2xl font-black text-[#006064]">฿ {parseFloat(amount).toFixed(2)}</span>
            </div>
            <div className="mt-auto w-full pt-6 mb-4">
              <button
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full bg-orange-50 text-orange-600 py-3 rounded-xl font-black text-[11px] uppercase border border-dashed border-orange-200 flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} className={isProcessing ? "animate-spin" : ""} />
                {isProcessing ? "Processing..." : "[ Dev Mode: Confirm Receive ]"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-300">
            <div className="w-36 h-36 bg-[#E0F2F1] rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg">
                <Check size={54} className="text-white stroke-[4px]" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-[#006064] tracking-tight">SUCCESS!</h2>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs text-center">Payment Received</p>
            </div>
            <div className="bg-white px-10 py-5 rounded-[2rem] shadow-sm border border-gray-100">
              <p className="text-4xl font-black text-[#006064]">
                ฿{parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-full pt-10">
              <button
                onClick={() => router.push('/merchantdashboard')}
                className="w-full bg-[#00695C] text-white py-5 rounded-[1.5rem] font-black text-lg uppercase shadow-lg active:scale-95 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}