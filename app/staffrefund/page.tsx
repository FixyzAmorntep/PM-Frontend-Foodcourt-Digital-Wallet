import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import StaffRefund from "@/components/pages/StaffRefund";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <StaffRefund />
    </Layout>
  );
}