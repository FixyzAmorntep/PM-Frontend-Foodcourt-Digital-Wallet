/* src/components/pages/QRTopup.tsx */
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function QRTopup() {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const quickAmounts = [20, 50, 100, 200, 500, 1000];

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

  const handleConfirm = async () => {
    if (amount <= 0) {
      alert("กรุณาระบุจำนวนเงิน");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    // 🔎 Debug ดูค่าก่อนส่ง (กด F12 ดูใน Console)
    console.log("Sending Payload:", {
      qr_token: "BYPASS_TOKEN",
      amount: parseFloat(amount.toString())
    });

    try {
      const response = await fetch('http://localhost:8080/api/v1/wallet/topup/qr', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          qr_token: "BYPASS_TOKEN", // ต้องตรงกับที่เช็คใน Go
          amount: parseFloat(amount.toString()) // บังคับเป็นเลขทศนิยมให้ Go
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`สำเร็จ! ยอดเงิน ฿${amount.toLocaleString()} เข้ากระเป๋าแล้วครับฟลุ๊ค`);
        router.push('/wallethome'); 
      } else {
        // 🚩 ถ้ายังขึ้น QR not found แสดงว่า Go มันข้ามด่าน Bypass ของเราไป
        console.error("Backend Error:", data);
        alert(`Backend แจ้งว่า: ${data.error} (ID: BYPASS_TOKEN)`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("ติดต่อ Server ไม่ได้ (เช็ค Terminal Go ว่ารันอยู่ไหม?)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      <div className="flex items-center px-6 py-5 bg-white sticky top-0 z-20">
        <Link href="/wallethome">
          <ChevronLeft className="text-gray-400 cursor-pointer" size={24} />
        </Link>
        <h1 className="text-lg font-black text-[#000000] flex-1 text-center mr-6 uppercase tracking-tight font-sans">PromptPay Top-up</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-8">
        <div className="bg-green-50/50 rounded-2xl p-5 flex justify-between items-center border border-green-100 shadow-sm">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Current Balance</p>
            <div className="flex items-center gap-2 text-[#000000]">
              <span className="text-xl font-bold">฿</span>
              <span className="text-2xl font-black tracking-tight font-sans">
                {currentBalance.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-[#035433]/10 rounded-xl flex items-center justify-center text-[#035433]">
            <Wallet size={24} />
          </div>
        </div>

        <div className="text-center space-y-4 pt-4">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Enter Top-up Amount</p>
          <div className="flex items-center justify-center gap-3">
            <span className={`text-4xl font-black ${amount > 0 ? 'text-[#035433]' : 'text-gray-200'}`}>฿</span>
            <input
              type="number"
              value={amount === 0 ? "" : amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") { setAmount(0); return; }
                const numValue = parseFloat(value);
                if (numValue < 0 || numValue > 10000) return;
                setAmount(numValue);
              }}
              placeholder="0.00"
              className={`text-6xl font-black tracking-tighter w-full max-w-[250px] text-center outline-none bg-transparent font-sans ${
                amount > 0 ? 'text-[#035433]' : 'text-gray-200'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {quickAmounts.map((val) => (
            <button 
              key={val}
              className={`py-4 rounded-2xl font-black text-xs border transition-all active:scale-95 font-sans ${
                amount === val 
                ? 'bg-[#035433] border-[#035433] text-white shadow-lg' 
                : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setAmount(val)}
            >
              ฿ {val}
            </button>
          ))}
        </div>

        <div className="pt-6 space-y-6">
          <div className="flex items-center justify-center gap-2 opacity-40">
             <div className="w-6 h-6 bg-slate-700 rounded-md flex items-center justify-center text-white font-black text-[8px] font-sans">QR</div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] font-sans">Bypass Mode Active</p>
          </div>
          
          <button 
            onClick={handleConfirm}
            disabled={amount <= 0 || loading}
            className={`w-full py-5 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest font-sans ${
              amount > 0 && !loading ? 'bg-[#035433] text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? "Processing..." : "Confirm Top-up"}
          </button>
        </div>
      </div>
    </div>
  );
}