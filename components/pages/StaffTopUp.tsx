/* src/components/pages/StaffTopup.tsx */
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Wallet, CheckCircle2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StaffTopup() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [phone, setPhone] = useState<string>(''); // ✨ เก็บเบอร์ที่พิมพ์
  const [userData, setUserData] = useState<any>(null); // ✨ เก็บข้อมูลที่ดึงมาจาก DB
  const [loading, setLoading] = useState(false);

  // 🔍 Function สำหรับดึงข้อมูล User เมื่อพิมพ์เบอร์ครบ
  useEffect(() => {
    const fetchUser = async () => {
      if (phone.length === 10) {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          // ยิงไปหา User ด้วยเบอร์ (ฟลุ๊คเช็ค Path API ใน Go อีกทีนะ)
          const response = await fetch(`http://localhost:8080/api/v1/users/search?phone=${phone}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setUserData(data); // data ควรมี full_name และ wallet.balance
          } else {
            setUserData(null);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
      }
    };
    fetchUser();
  }, [phone]);

  const handleConfirm = async () => {
    if (amount > 0 && userData) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // ✨ ยิง API ไปที่ path /topup/cash ที่เราทำไว้ใน Go
        const response = await fetch('http://localhost:8080/api/v1/wallet/topup/cash', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            phone: phone,   // ส่งเบอร์โทร
            amount: amount  // ส่งจำนวนเงิน
          }),
        });

        if (response.ok) {
          // ✅ ถ้าเติมสำเร็จ ค่อยเด้งไปหน้า Success
          router.push(`/stafftopupsuccess?amount=${amount}&phone=${phone}&name=${userData.full_name}`);
        } else {
          const errorData = await response.json();
          alert(`เติมเงินไม่สำเร็จ: ${errorData.error || 'เกิดข้อผิดพลาด'}`);
        }
      } catch (err) {
        console.error(err);
        alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
      } finally {
        setLoading(false);
      }
    }
  };

  const quickAmounts = [20, 50, 100, 200, 500, 1000];

  return (
    <div className="flex flex-col h-full bg-white font-sans min-h-screen">
      
      {/* Header Section - UI เดิม */}
      <div className="flex items-center px-6 py-5 bg-white sticky top-0 z-20 border-b border-gray-50">
        <button onClick={() => router.back()}>
          <ChevronLeft className="text-gray-400 cursor-pointer" size={24} />
        </button>
        <h1 className="text-lg font-black text-[#000000] flex-1 text-center mr-6 uppercase tracking-tight">Staff Top-up</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-6 pt-6">
        
        {/* ✨ เพิ่มช่องกรอกเบอร์โทรศัพท์ (UI กลมกลืนกับของเดิม) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer Phone</label>
          <div className="relative">
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number..."
              className="w-full bg-gray-50 border border-gray-100 py-4 px-5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#035433]/10 transition-all"
            />
          </div>
        </div>

        {/* Account Owner Card - ✨ แสดงผลตามข้อมูลจริงที่ค้นหาเจอ */}
        <div className={`flex items-center gap-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100 transition-opacity ${!userData ? 'opacity-40' : 'opacity-100'}`}>
          <div className="relative">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.full_name || 'Guest'}`} 
              className="w-14 h-14 rounded-2xl bg-white shadow-sm"
              alt="Avatar"
            />
            {userData && (
              <div className="absolute -bottom-1 -right-1">
                <CheckCircle2 size={18} className="text-[#00E676] fill-white" />
              </div>
            )}
          </div>
          <div>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-0.5">Account Owner</span>
            <h2 className="text-base font-black text-gray-900">{userData ? userData.full_name : "Waiting for phone..."}</h2>
            <p className="text-[10px] font-bold text-gray-400">Status: {userData ? "Ready" : "Not found"}</p>
          </div>
        </div>

        {/* Current Balance Card - ✨ ดึง Balance จริงจาก Wallet */}
        <div className="bg-green-50/50 rounded-2xl p-5 flex justify-between items-center border border-green-100 shadow-sm">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Current Balance</p>
            <div className="flex items-center gap-2 text-[#000000]">
              <span className="text-xl font-bold">฿</span>
              <span className="text-2xl font-black tracking-tight font-sans">
                {/* ✨ เปลี่ยนจาก userData?.wallet?.balance เป็น userData?.balance */}
                {userData?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0.00"}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-[#004D40]/10 rounded-xl flex items-center justify-center text-[#004D40]">
            <Wallet size={24} />
          </div>
        </div>

        {/* Input Amount Section - UI เดิม */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Enter Top-up Amount</p>
          <div className="flex items-center justify-center gap-2">
            <span className={`text-2xl font-black ${amount > 0 ? 'text-[#035433]' : 'text-gray-200'}`}>฿</span>
            <input
              type="number"
              value={amount === 0 ? "" : amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className={`text-6xl font-black tracking-tighter w-full max-w-[250px] text-center outline-none bg-transparent font-sans ${
                amount > 0 ? 'text-[#035433]' : 'text-gray-200'
              }`}
            />
          </div>
        </div>

        {/* Quick Amount Grid - UI เดิม */}
        <div className="grid grid-cols-3 gap-3">
          {quickAmounts.map((val) => (
            <button 
              key={val}
              className={`py-4 rounded-2xl font-black text-xs border transition-all active:scale-95 font-sans ${
                amount === val 
                ? 'bg-[#035433] border-[#035433] text-white' 
                : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setAmount(val)}
            >
              ฿ {val}
            </button>
          ))}
        </div>

        {/* Confirm Button - UI เดิม */}
        <div className="pt-6">
          <button 
            onClick={handleConfirm}
            disabled={amount <= 0 || !userData}
            className={`w-full py-5 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest font-sans ${
              (amount > 0 && userData) ? 'bg-[#035433] text-white shadow-green-900/20' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            Confirm Top-up
          </button>
        </div>

      </div>
    </div>
  );
}