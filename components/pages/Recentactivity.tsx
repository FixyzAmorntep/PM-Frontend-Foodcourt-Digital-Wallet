/* src/components/pages/TransactionHistory.tsx */
'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: string;
  type: 'TOPUP_QR' | 'TOPUP_CASH' | 'PAYMENT' | 'REFUND';
  amount: number;
  created_at: string;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:8080/api/v1/wallet/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          
          const formattedData = data.map((tx: Transaction) => {
            const dateObj = new Date(tx.created_at);
            
            let displayTitle = "";
            let isExpense = false;

            // 🚀 Logic: เช็คตาม Enum Type จากภาพโครงสร้างตารางที่ฟลุ๊คส่งมา
            switch (tx.type) {
              case 'PAYMENT':
                displayTitle = "จ่ายค่าอาหาร/เครื่องดื่ม";
                isExpense = true; // จ่ายเงิน = สีแดง
                break;
              case 'TOPUP_QR':
              case 'TOPUP_CASH':
                displayTitle = "เติมเงินเข้ากระเป๋า";
                isExpense = false; // เติมเงิน = สีเขียว
                break;
              case 'REFUND':
                displayTitle = "แลกคืนเงินสด";
                isExpense = true; // คืนเงิน = สีแดง
                break;
              default:
                displayTitle = "รายการธุรกรรม";
            }

            return {
              id: tx.id,
              title: displayTitle,
              amount: tx.amount,
              isExpense: isExpense,
              date: dateObj.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' }),
              time: dateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
            };
          });
          
          setTransactions(formattedData);
        }
      } catch (error) {
        console.error("Fetch history error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFB] font-sans overflow-hidden">
      
      {/* 1. Header Bar */}
      <div className="flex items-center px-6 py-5 bg-white border-b border-gray-50 shrink-0 z-30">
        <Link href="/wallethome">
          <ChevronLeft className="text-[#00E676] active:scale-90 transition-transform" size={24} strokeWidth={3} />
        </Link>
        <h1 className="flex-1 text-center text-lg font-black text-[#1a1c1e] tracking-tight mr-6 ">
          Recent Activity
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden mb-6">
          
          {/* Header แถวบนสุด */}
          <div className="grid grid-cols-12 px-6 py-4 border-b border-gray-50 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
            <div className="col-span-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Date & Time</div>
            <div className="col-span-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Transaction Type</div>
            <div className="col-span-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</div>
          </div>

          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="py-20 text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-widest">Loading Records...</p></div>
            ) : transactions.length > 0 ? (
              transactions.map((item) => (
                <div key={item.id} className="grid grid-cols-12 px-6 py-5 items-center hover:bg-gray-50/50 transition-colors">
                  
                  {/* 1. Date & Time */}
                  <div className="col-span-4">
                    <p className="text-[11px] font-black text-gray-800 mb-0.5">{item.date}</p>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">{item.time}</p>
                  </div>

                  {/* 2. Transaction Type (จุดสีแดง/เขียว) */}
                  <div className="col-span-5 flex items-center gap-2.5 overflow-hidden justify-end pr-4">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      item.isExpense ? 'bg-red-500' : 'bg-[#00E676]'
                    }`}></div>
                    <span className="text-[11px] font-black text-gray-600 truncate uppercase">
                      {item.title}
                    </span>
                  </div>

                  {/* 3. Amount (ตัวเลข -/+ และ สีแดง/เขียว) */}
                  <div className="col-span-3 text-right">
                    <span className={`text-[11px] font-black ${
                      item.isExpense ? 'text-red-500' : 'text-[#00E676]'
                    }`}>
                      {item.isExpense ? '- ' : '+ '}฿{Math.abs(item.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center opacity-30">
                <ShoppingBag size={48} className="mx-auto mb-4" />
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No activity found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}