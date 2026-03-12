'use client';
import React, { useState } from "react";
import Sidebar from "./Sidebar"; 

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7F9] flex justify-center items-start font-sans">
      <div className="w-full sm:max-w-[430px] h-screen bg-white flex flex-col border-x border-gray-200 shadow-sm relative overflow-hidden">
        
        {/* Sidebar จะมีอยู่เสมอ แต่จะเปิดได้ก็ต่อเมื่อมีคนสั่ง setIsOpen(true) */}
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* ส่งฟังก์ชัน openMenu ลงไปให้หน้าลูกๆ ทุกหน้า */}
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { openMenu: () => setIsOpen(true) } as any);
            }
            return child;
          })}
        </main>

      </div>
    </div>
  );
}