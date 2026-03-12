'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  LayoutDashboard, Store, Users, Settings, 
  QrCode, Banknote, RefreshCcw, ShoppingBag, 
  Search, MoreVertical, CalendarIcon, Percent, FileText, LogOut,
  Plus, Edit2, ChevronLeft, ChevronRight
} from 'lucide-react';

import GPModal from '../modals/GPModal'; 
import VATModal from '../modals/VATModal';
import CalendarModal from '../modals/CalendarModal';
import StallFormModal from '../modals/StallFormModal';
import StaffFormModal from '../modals/StaffFormModal';
import ChangePasswordModal from '../modals/ChangePasswordModal';

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState('Administrator');
  const [currentView, setCurrentView] = useState<'main' | 'revenue' | 'restaurants' | 'staff' | 'settings'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');

  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [staffAction, setStaffAction] = useState<'list' | 'add' | 'edit'>('list');

  const [stallAction, setStallAction] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedStall, setSelectedStall] = useState<any>(null);
  const [newStall, setNewStall] = useState({ name: '', category: 'General Food' });

  const [isGPModalOpen, setIsGPModalOpen] = useState(false);
  const [gpRate, setGpRate] = useState(20);
  const [isVATModalOpen, setIsVATModalOpen] = useState(false); 
  const [vatRate, setVatRate] = useState(7); 
  const [isStallModalOpen, setIsStallModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isCPModalOpen, setIsCPModalOpen] = useState(false);

  
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [summary, setSummary] = useState({
    totalSalesAmount: 0, totalSalesCount: 0, qrTopupAmount: 0, cashTopupAmount: 0, cashRefundAmount: 0
  });
  const [stallReports, setStallReports] = useState<any[]>([]);

  // 🚩 ดึงข้อมูลร้านค้าตัวเดียว (Owner/Phone) จาก API Admin
  const fetchSingleStall = async (id: string) => {
    if (!id || id === 'undefined') return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/v1/admin/stalls/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedStall(data);
      }
    } catch (err) { console.error("Fetch single stall error:", err); }
  };

  const fetchReportData = useCallback(async (start: string, end: string) => {
    try {
      const token = localStorage.getItem('token'); 
      const headers = { 'Authorization': `Bearer ${token}` };
      const resSum = await fetch(`http://localhost:8080/api/v1/admin/summary?start=${start}&end=${end}`, { headers });
      if (resSum.ok) setSummary(await resSum.json());
      
      const resRep = await fetch(`http://localhost:8080/api/v1/admin/reports/revenue?start=${start}&end=${end}`, { headers });
      if (resRep.ok) {
        const data = await resRep.json();
        // data อาจเป็น { data: [...] } หรือ [...] ขึ้นอยู่กับ backend
        setStallReports(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) { console.error("Fetch reports error:", err); }
  }, []);

  const fetchStaff = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');
    // ใช้ API เดิมที่มีอยู่แล้วเพื่อดึงเฉพาะ STAFF
    const res = await fetch(`http://localhost:8080/api/v1/admin/users?role=STAFF`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setStaffList(data);
    }
  } catch (err) { console.error("Fetch staff error:", err); }
  }, []);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setAdminName(name);

    if (currentView === 'main' || currentView === 'revenue' || currentView === 'restaurants') {
      fetchReportData(dateRange.start, dateRange.end);
    }

    if (currentView === 'staff') {
      fetchStaff(); 
    }

    fetchReportData(dateRange.start, dateRange.end);
  }, [fetchReportData, fetchStaff, dateRange.start, dateRange.end, currentView]);

  const handleToggleView = (mode: 'daily' | 'monthly') => {
    setViewMode(mode);
    const now = new Date();
    let s = mode === 'daily' ? now.toISOString().split('T')[0] : new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    let e = mode === 'daily' ? s : new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    setDateRange({ start: s, end: e });
    fetchReportData(s, e);
  };
  

  const handleCreateStall = async () => {
    if (!newStall.name) return alert("โปรดใส่ชื่อร้านค้า");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/v1/admin/stalls`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ stall_name: newStall.name, category: newStall.category })
      });
      if (res.ok) {
        alert("สร้างสำเร็จ!");
        setStallAction('list');
        setNewStall({ name: '', category: 'General Food' });
        fetchReportData(dateRange.start, dateRange.end);
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveStall = async (formData: any) => {
    const token = localStorage.getItem('token');
    const id = selectedStall?.shopId || selectedStall?.id || selectedStall?.ID;
    
    const url = selectedStall 
      ? `http://localhost:8080/api/v1/admin/stalls/${id}` 
      : `http://localhost:8080/api/v1/admin/stalls`;
    
    const method = selectedStall ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsStallModalOpen(false); 
        if (selectedStall && id) fetchSingleStall(id); 
        fetchReportData(dateRange.start, dateRange.end); 
        alert("บันทึกข้อมูลเรียบร้อย!");
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveStaff = async (formData: any) => {
    const token = localStorage.getItem('token');
    const isEdit = staffAction === 'edit';
    const id = selectedStaff?.id;

    // เลือก URL และ Method ตาม Action (ถ้ามี ID แปลว่าแก้ไข)
    const url = isEdit 
      ? `http://localhost:8080/api/v1/admin/staff/${id}` 
      : `http://localhost:8080/api/v1/admin/staff`;
    
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          full_name: formData.full_name,
          phone: formData.phone // 🚩 ส่งเบอร์โทรไปด้วยตามที่เพิ่มใน Modal
        })
      });

      if (res.ok) {
        setIsStaffModalOpen(false); // ปิด Modal พนักงาน
        fetchStaff(); // โหลดรายชื่อพนักงานใหม่มาอัปเดตในตารางทันที
        alert(isEdit ? "อัปเดตข้อมูลพนักงานเรียบร้อย" : "ลงทะเบียนพนักงานใหม่สำเร็จ (รหัสผ่านคือ password)");
      } else {
        const errorData = await res.json();
        alert("เกิดข้อผิดพลาด: " + (errorData.message || "บันทึกไม่สำเร็จ"));
      }
    } catch (err) { 
      console.error("Save staff error:", err);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
  };

  const handleLogout = () => {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
        localStorage.clear(); // ล้าง Token และชื่อ Admin
        window.location.href = '/admin-portal/login'; // เด้งกลับไปหน้า Login
    }
  };
  

  const filteredStalls = stallReports.filter((report: any) => {
    const name = report.stall_name || report.shopName || "";
    const isGibberish = /[^\u0000-\u007F\u0E00-\u0E7F]/.test(name);
    const isSystemAccount = name.includes("SYSTEM") || name.includes("Unknown");
    return !isGibberish && !isSystemAccount && name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderManageRestaurants = () => {
    // 🔵 1. หน้าเพิ่มร้านค้า
    if (stallAction === 'add') {
      return (
        <div className="animate-in slide-in-from-right-4 duration-500 w-full max-w-[600px] bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setStallAction('list')} className="p-2 hover:bg-slate-100 rounded-full transition-all"><ChevronLeft size={20}/></button>
            <h2 className="text-xl font-black text-slate-800 uppercase">Register New Shop</h2>
          </div>
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#006D5B] uppercase ml-2">Restaurant Name</label>
              <input value={newStall.name} onChange={(e) => setNewStall({...newStall, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#006D5B] transition-all" placeholder="Enter shop name..." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#006D5B] uppercase ml-2">Category</label>
              <select value={newStall.category} onChange={(e) => setNewStall({...newStall, category: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#006D5B] transition-all">
                <option>General Food</option><option>Noodles</option><option>Drinks</option>
              </select>
            </div>
            <button onClick={handleCreateStall} className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:shadow-lg active:scale-95 transition-all">Create Establishment</button>
          </div>
        </div>
      );
    }

    // 🔵 2. หน้า Profile ร้านค้า (Edit Mode)
    if (stallAction === 'edit' && selectedStall) {
      const handleToggleStatus = async () => {
      const currentStatus = selectedStall.status || selectedStall.Status || 'ACTIVE';
      const newStatus = currentStatus === 'ACTIVE' || currentStatus === 'OPEN' ? 'SUSPENDED' : 'ACTIVE';
      
      if (!confirm(`ยืนยันการเปลี่ยนสถานะเป็น ${newStatus}?`)) return;

      try {
        const token = localStorage.getItem('token');
        const id = selectedStall.id || selectedStall.ID || selectedStall.shopId;

        const res = await fetch(`http://localhost:8080/api/v1/admin/stalls/${id}/status`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
          const targetId = selectedStall.id || selectedStall.ID || selectedStall.shopId;

          // 🚩 1. อัปเดตตัวแปรที่โชว์ในหน้า Profile
          setSelectedStall({ ...selectedStall, status: newStatus });

          // 🚩 2. บังคับอัปเดต Array ที่ใช้โชว์ในตารางหน้าแรก (stallReports)
          setStallReports((prevReports) => 
              prevReports.map((item) => {
                  // เช็ค ID ให้ตรงกัน (เผื่อ Backend ส่ง key มาไม่เหมือนกัน)
                  const itemId = item.id || item.ID || item.shopId;
                  if (itemId === targetId) {
                      return { ...item, status: newStatus }; // เปลี่ยนเฉพาะสถานะร้านนี้
                  }
                  return item;
              })
          );

          alert(`เปลี่ยนสถานะเป็น ${newStatus} เรียบร้อยแล้วครับฟลุ๊ค!`);
      }
      } catch (err) { console.error(err); }
    };

      return (
        <div className="animate-in slide-in-from-right-4 duration-500 w-full max-w-[500px] flex flex-col items-center text-left">
          <div className="w-full flex mb-4">
            <button onClick={() => setStallAction('list')} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase transition-all">
              <ChevronLeft size={16}/> Back to List
            </button>
          </div>
          <div className="w-full bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-800 leading-tight">{selectedStall.stall_name || selectedStall.StallName || selectedStall.shopName}</h2>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                      ID: #R-{(selectedStall.id || selectedStall.ID || selectedStall.shopId || "").substring(0, 8)}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase ${
                  (selectedStall.status || selectedStall.Status) === 'ACTIVE' || (selectedStall.status || selectedStall.Status) === 'OPEN' 
                  ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                  : 'bg-rose-50 text-rose-500 border-rose-100'
                }`}>
                  {selectedStall.status || selectedStall.Status || 'ACTIVE'}
                </span>
              </div>
              <div className="space-y-6 pt-2">
                <div className="flex items-center border-b border-slate-50 pb-4">
                  <div className="w-32 shrink-0 flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest"><Users size={14} /> Owner</div>
                  <div className="text-sm font-black text-slate-700 ml-2">{selectedStall.owner_name || selectedStall.OwnerName || "Not Specified"}</div>
                </div>
                <div className="flex items-center border-b border-slate-50 pb-4">
                  <div className="w-32 shrink-0 flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest"><Banknote size={14} /> Phone</div>
                  <div className="text-sm font-black text-slate-700 ml-2">{selectedStall.phone || selectedStall.Phone || "No Phone Info"}</div>
                </div>           
              </div>
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <button onClick={() => setIsStallModalOpen(true)} className="flex-1 bg-white border border-slate-200 text-slate-500 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-sm"><Edit2 size={16} /> Edit</button>
              <button onClick={handleToggleStatus} className={`flex-1 border py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm ${
                (selectedStall.status || selectedStall.Status) === 'ACTIVE' || (selectedStall.status || selectedStall.Status) === 'OPEN' 
                ? 'bg-white border-slate-200 text-rose-500' 
                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
                <RefreshCcw size={16} /> {(selectedStall.status || selectedStall.Status) === 'ACTIVE' || (selectedStall.status || selectedStall.Status) === 'OPEN' ? 'Suspend' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 🔵 3. หน้ารวมรายการ (List Mode)
    return (
      <div className="animate-in fade-in duration-500 w-full max-w-[1073px] space-y-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col text-left">
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Manage Restaurants</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Directory of all registered food establishments</p>
          </div>
          <button onClick={() => { setSelectedStall(null); setIsStallModalOpen(true); }} className="bg-black text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 hover:bg-slate-800 active:scale-95 transition-all shadow-md">
            <Plus size={16} strokeWidth={3} /> Add Restaurant
          </button>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50"><div className="relative max-w-sm w-full"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type="text" placeholder="Search by shop name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-xs font-bold outline-none" /></div></div>
          <table className="w-full text-left">
            <thead><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50"><th className="px-8 py-4">Restaurant Name</th><th className="px-8 py-4 text-center">Category</th><th className="px-8 py-4 text-center">Status</th><th className="px-8 py-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStalls.map((stall, idx) => {
                // 🚩 แก้ไข: backend ส่งมาเป็น shopId ตามรูป preview
                const id = stall.shopId || stall.id || stall.ID;
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" 
                    onClick={() => { 
                      if(id) { 
                        setStallAction('edit'); 
                        fetchSingleStall(id); 
                      } else { 
                        console.log("Missing ID in object:", stall);
                        alert("ID ร้านค้าไม่ถูกต้อง"); 
                      } 
                    }}>
                    <td className="px-8 py-5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#006D5B] group-hover:bg-[#006D5B] group-hover:text-white transition-all"><Store size={16}/></div><span className="text-sm font-black text-slate-700 group-hover:text-[#006D5B]">{stall.stall_name || stall.shopName}</span></div></td>
                    <td className="px-8 py-5 text-center text-[10px] font-bold text-slate-400 uppercase">{stall.category || stall.shopType || "General Food"}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase ${
                        (stall.status || stall.Status) === 'ACTIVE' || (stall.status || stall.Status) === 'OPEN' ? 'bg-emerald-50 text-[#006D5B]' : 'bg-rose-50 text-rose-500'
                      }`}>
                        {stall.status || stall.Status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right"><button className="p-2 text-slate-300 hover:text-blue-500 transition-colors"><Edit2 size={16}/></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRevenueContent = () => (
    <div className="animate-in fade-in duration-500 w-full max-w-[1073px] space-y-6">
      <div className="flex flex-col text-left">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Revenue Results View</h1>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Detailed financial breakdown per establishment</p>
      </div>
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-fit shadow-inner border border-slate-200">
        <button onClick={() => handleToggleView('daily')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${viewMode === 'daily' ? 'bg-white text-[#006D5B] shadow-md' : 'text-slate-400'}`}>Today</button>
        <button onClick={() => handleToggleView('monthly')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${viewMode === 'monthly' ? 'bg-white text-[#006D5B] shadow-md' : 'text-slate-400'}`}>Monthly</button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        <div onClick={() => setIsCalendarOpen(true)}><ActionButton icon={<CalendarIcon size={18}/>} label={viewMode === 'daily' ? "Daily Range" : "Monthly Range"} sub={`${dateRange.start} - ${dateRange.end}`} /></div>
        <div onClick={() => setIsGPModalOpen(true)}><ActionButton icon={<Percent size={18}/>} label="Edit %GP" sub={`${gpRate}%`} /></div>
        <div onClick={() => setIsVATModalOpen(true)}><ActionButton icon={<FileText size={18}/>} label="Edit %VAT" sub={`${vatRate}%`} /></div>
      </div>
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50"><div className="relative max-w-sm w-full"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type="text" placeholder="Search Shop Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-xs font-bold outline-none" /></div></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[800px]"> 
            <thead><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50"><th className="px-8 py-4 w-[35%]">Shop Name</th><th className="px-4 py-4 text-right w-[20%]">Total Sales</th><th className="px-4 py-4 text-right w-[20%]">%GP</th><th className="px-4 py-4 text-right w-[20%] text-[#006D5B]">Net Income</th><th className="px-8 py-4 w-[5%]"></th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStalls.map((report: any, idx) => {
                const amount = Number(report.paymentAmt || report.daily_revenue || report.total_amount || 0);
                const gp = (amount * gpRate) / 100;
                const net = amount - gp - ((amount * vatRate) / 100);
                const sName = report.stall_name || report.shopName || "Unknown";
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 flex items-center gap-3 text-left"><div className="w-8 h-8 rounded-full bg-[#006D5B]/5 flex items-center justify-center text-[10px] font-black text-[#006D5B]">{sName.substring(0, 2).toUpperCase()}</div><span className="text-sm font-black text-slate-700 truncate">{sName}</span></td>
                    <td className="px-4 py-5 text-right text-xs font-black">฿{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-5 text-right text-xs font-bold text-slate-400">฿{gp.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-5 text-right text-sm font-black text-[#006D5B] bg-emerald-50/30">฿{net.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-8 py-5 text-right"><MoreVertical size={18} className="text-slate-300 inline"/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderManageStaff = () => {
  const filteredStaff = staffList.filter((staff: any) => {
    const name = staff.full_name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-[1073px] space-y-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col text-left">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Manage Staff</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Operational personnel management</p>
        </div>
        <button 
          onClick={() => { setSelectedStaff(null); setStaffAction('add'); setIsStaffModalOpen(true); }} 
          className="bg-black text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 hover:bg-slate-800 active:scale-95 transition-all shadow-md"
        >
          <Plus size={16} strokeWidth={3} /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type="text" placeholder="Search by staff name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-xs font-bold outline-none" />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-8 py-4 w-[50%]">Staff Name</th> 
              <th className="px-8 py-4 text-center w-[20%]">Status</th>
              <th className="px-8 py-4 text-right w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredStaff.map((staff, idx) => (
              <tr 
                key={idx} 
                className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                onClick={() => { setSelectedStaff(staff); setStaffAction('edit'); setIsStaffModalOpen(true); }}
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    {/* 🚩 ปรับสีให้เป็น Emerald เหมือนหน้าแรกเพื่อความกลมกลืน */}
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#006D5B] group-hover:bg-[#006D5B] group-hover:text-white transition-all">
                      <Users size={16}/>
                    </div>
                    <span className="text-sm font-black text-slate-700 group-hover:text-[#006D5B]">
                      {staff.full_name}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase ${
                    staff.status === 'ACTIVE' ? 'bg-emerald-50 text-[#006D5B]' : 'bg-rose-50 text-rose-500'
                  }`}>
                    {staff.status || 'ACTIVE'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  {/* 🚩 เอา div flex ออกเพื่อให้ปุ่มชิดขวาตาม text-right ของ td */}
                  <button className="p-2 text-slate-300 hover:text-blue-500 transition-colors">
                    <Edit2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const renderSettingsContent = () => {
  return (
    <div className="animate-in fade-in duration-500 w-full max-w-[600px] flex flex-col items-center">
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Admin Settings</h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Manage your account and session</p>
      </div>

      <div className="w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8 space-y-4">
        
        {/* Change Password Row */}
        <button 
          onClick={() => setIsCPModalOpen(true)} // เดี๋ยวค่อยทำ Modal ตัวนี้ต่อครับ
          className="w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#006D5B]">
              <div className="p-2 border-2 border-[#006D5B] rounded-lg">
                <Settings size={18} /> 
              </div>
            </div>
            <span className="text-sm font-black text-slate-700 group-hover:text-[#006D5B]">Change Password</span>
          </div>
          <ChevronRight size={20} className="text-slate-300 group-hover:text-[#006D5B]" />
        </button>

        {/* Log Out Row */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-5 bg-rose-50 border border-rose-100 rounded-2xl hover:bg-rose-100 transition-all group"
        >
          <LogOut size={18} className="text-rose-500" />
          <span className="text-sm font-black text-rose-500 uppercase tracking-widest">Log Out</span>
        </button>

      </div>
    </div>
  );
};

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      <aside className="w-72 flex flex-col sticky top-0 h-screen border-r border-slate-200 shrink-0 shadow-sm bg-[#f5f5f5]">
        <div className="p-10"><h2 className="text-xl font-black text-[#006D5B]">RestoAdmin</h2></div>
        <nav className="flex-1 px-6 space-y-2">
          <div onClick={() => setCurrentView('main')}><NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={currentView === 'main'} /></div>
          <div onClick={() => { setCurrentView('restaurants'); setStallAction('list'); }}><NavItem icon={<Store size={20}/>} label="Manage Restaurants" active={currentView === 'restaurants'} /></div>
          <div onClick={() => setCurrentView('revenue')}><NavItem icon={<FileText size={20}/>} label="Revenue Reports" active={currentView === 'revenue'} /></div>
          <div onClick={() => { setCurrentView('staff'); setStaffAction('list'); }}><NavItem icon={<Users size={20}/>} label="Manage Staff" active={currentView === 'staff'} /></div>
          <div onClick={() => setCurrentView('settings')}><NavItem icon={<Settings size={20}/>} label="Settings" active={currentView === 'settings'} /></div>
        </nav>
        <div className="p-8 border-t border-slate-200"><button onClick={handleLogout} className="flex items-center gap-3 px-4 text-slate-400 font-bold text-sm hover:text-red-500 transition-colors w-full"><LogOut size={18} /> Logout</button></div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 border-l border-slate-200">
        <header className="h-20 bg-white border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-black text-slate-700 uppercase tracking-tight">{currentView === 'main' ? 'Dashboard' : currentView === 'revenue' ? 'Revenue Report' : 'Manage Restaurants'}</h1>
          <div className="flex items-center gap-3">
            <div className="text-right pr-2"><p className="text-xs font-black text-slate-900 leading-none">{adminName}</p><p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Administrator</p></div>
            <img className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src={`https://ui-avatars.com/api/?name=${adminName}&background=006D5B&color=fff`} />
          </div>
        </header>

        <div className="p-8 space-y-8 w-full flex flex-col items-center overflow-y-auto">
          {currentView === 'main' && (
            <div className="w-full max-w-[1073px] space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-inner">
                <button onClick={() => handleToggleView('daily')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${viewMode === 'daily' ? 'bg-white text-[#006D5B] shadow-md' : 'text-slate-400'}`}>Today</button>
                <button onClick={() => handleToggleView('monthly')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${viewMode === 'monthly' ? 'bg-white text-[#006D5B] shadow-md' : 'text-slate-400'}`}>Monthly</button>
              </div>
              <div className="flex flex-row gap-4 mb-8 overflow-x-auto no-scrollbar">
                <StatCard title={`QR TOP-UP (${viewMode})`} amount={`฿${summary.qrTopupAmount.toLocaleString()}`} icon={<QrCode size={18} className="text-blue-500" />} />
                <StatCard title={`CASH TOP-UP (${viewMode})`} amount={`฿${summary.cashTopupAmount.toLocaleString()}`} icon={<Banknote size={18} className="text-emerald-500" />} />
                <StatCard title={`CASH REFUND (${viewMode})`} amount={`฿${summary.cashRefundAmount.toLocaleString()}`} icon={<RefreshCcw size={18} className="text-rose-500" />} />
                <StatCard title={`TOTAL SALES (${viewMode})`} amount={`฿${summary.totalSalesAmount.toLocaleString()}`} icon={<ShoppingBag size={18} className="text-[#006D5B]" />} />
              </div>
              <div className="bg-white rounded-[1.5rem] p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-6 w-full text-slate-900 uppercase font-black cursor-pointer hover:bg-slate-50 transition-all" onClick={() => setCurrentView('revenue')}>
                Restaurant Revenue Info
                <div className="border border-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter">VIEW REPORTS</div>
              </div>
            </div>
          )}
          {currentView === 'revenue' && renderRevenueContent()}
          {currentView === 'restaurants' && renderManageRestaurants()}
          {currentView === 'staff' && renderManageStaff()}
          {currentView === 'settings' && renderSettingsContent()}
        </div>
      </main>

      <StallFormModal isOpen={isStallModalOpen} onClose={() => setIsStallModalOpen(false)} onSave={handleSaveStall}initialData={selectedStall} />
      <GPModal isOpen={isGPModalOpen} onClose={() => setIsGPModalOpen(false)} value={gpRate} onSave={(v: number) => { setGpRate(v); setIsGPModalOpen(false); }} />
      <VATModal isOpen={isVATModalOpen} onClose={() => setIsVATModalOpen(false)} value={vatRate} onSave={(v: number) => { setVatRate(v); setIsVATModalOpen(false); }} />
      <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} startDate={dateRange.start} endDate={dateRange.end} onSave={(s: string, e: string) => { setDateRange({ start: s, end: e }); setIsCalendarOpen(false); }} />
      <StaffFormModal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} onSave={handleSaveStaff} initialData={selectedStaff} />
      <ChangePasswordModal isOpen={isCPModalOpen} onClose={() => setIsCPModalOpen(false)} />
    </div>
  );
}

function ActionButton({ icon, label, sub }: any) {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4 hover:shadow-sm transition-all min-w-[200px] cursor-pointer">
      <div className="p-2 bg-emerald-50 rounded-lg text-[#006D5B]">{icon}</div>
      <div><p className="text-[10px] font-black text-[#006D5B] uppercase leading-none">{label}</p><p className="text-[9px] font-bold text-slate-400 mt-1">{sub}</p></div>
    </div>
  );
}

function StatCard({ title, amount, icon }: any) {
  return (
    <div className="bg-white border-slate-200 rounded-[1rem] p-5 border shadow-sm flex flex-col justify-evenly h-40 w-64 shrink-0">
      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">{icon}</div>
      <div className="mt-4"><p className="text-[8px] font-black uppercase text-slate-400">{title}</p><p className="text-xl font-black text-slate-900">{amount}</p></div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-emerald-50 text-[#006D5B] font-black' : 'text-slate-400 font-bold hover:bg-white hover:text-[#006D5B]'}`}>
      {icon} <span className="text-sm tracking-tight">{label}</span>
    </div>
  );
}