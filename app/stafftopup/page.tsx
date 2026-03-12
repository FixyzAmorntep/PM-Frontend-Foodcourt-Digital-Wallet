import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import StaffTopUp from "@/components/pages/StaffTopUp";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <StaffTopUp />
    </Layout>
  );
}