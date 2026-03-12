/* src/components/pages/StaffRefund.tsx */
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StaffRefund() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [phone, setPhone] = useState<string>('');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (phone.length === 10) {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:8080/api/v1/users/search?phone=${phone}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
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
        setAmount(0);
      }
    };
    fetchUser();
  }, [phone]);

  const handleRefund = async () => {
    if (amount > 0 && userData) {
      if (amount > userData.balance) {
        alert("ยอดเงินในกระเป๋าไม่พอ");
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/v1/wallet/refund/cash', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ phone, amount }),
        });

        if (response.ok) {
          router.push(`/staffrefundsuccess?amount=${amount}&phone=${phone}&name=${userData.full_name}&type=REFUND`);
        } else {
          const errorData = await response.json();
          alert(errorData.message || "เกิดข้อผิดพลาด");
        }
      } catch (err) { 
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ"); 
      } finally { 
        setLoading(false); 
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans min-h-screen">
      <div className="flex items-center px-6 py-5 bg-white border-b border-gray-50">
        <button onClick={() => router.back()} className="active:scale-90 transition-transform">
          <ChevronLeft className="text-gray-400" size={24} />
        </button>
        <h1 className="text-lg font-black text-[#1a1c1e] flex-1 text-center mr-6 uppercase tracking-tight">Staff Refund</h1>
      </div>

      <div className="flex-1 px-8 pt-6 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Customer Phone</label>
          <input 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09X-XXX-XXXX"
            className="w-full bg-gray-50 border border-gray-100 py-4 px-5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
          />
        </div>

        <div className={`flex items-center gap-4 bg-white p-5 rounded-[1.5rem] border border-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all ${!userData ? 'opacity-40 grayscale' : 'opacity-100'}`}>
          <div className="w-14 h-14 bg-[#F1FDF7] rounded-2xl flex items-center justify-center border border-[#E8F8F0]">
            {userData ? <CheckCircle2 className="text-[#035433]" size={28} /> : <AlertCircle className="text-gray-300" size={28} />}
          </div>
          <div>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-0.5">Refund From</span>
            <h2 className="text-[15px] font-black text-[#1a1c1e] leading-none mb-1">{userData ? userData.full_name : "Enter Phone Number"}</h2>
            <p className="text-[11px] font-black text-[#035433] tracking-tight">Current Balance: ฿{userData?.balance?.toLocaleString(undefined, {minimumFractionDigits: 2}) || "0.00"}</p>
          </div>
        </div>

        <div className="text-center space-y-2 pt-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Refund Amount</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-black text-red-600">฿</span>
            <input
              type="number" 
              value={amount || ""} 
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="text-6xl font-black tracking-tighter w-full max-w-[250px] text-center outline-none bg-transparent text-red-600"
            />
          </div>
        </div>

        <div className="pt-6">
          <button 
            onClick={handleRefund}
            disabled={amount <= 0 || !userData || amount > userData.balance}
            style={{
              backgroundColor: '#FF3B30', 
              color: '#000000',           
            }}
            className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-lg transition-all
              ${(amount > 0 && userData && amount <= userData.balance) 
                ? 'opacity-100 active:scale-[0.98] shadow-red-200' 
                : 'opacity-40 cursor-not-allowed'
              }`}
          >
            {loading ? "Processing..." : "Confirm Refund"}
          </button>
        </div>
      </div>
    </div>
  );
}