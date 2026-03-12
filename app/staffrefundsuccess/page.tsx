import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import StaffRefundSuccess from "@/components/pages/StaffRefundSuccess";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <StaffRefundSuccess />
    </Layout>
  );
}