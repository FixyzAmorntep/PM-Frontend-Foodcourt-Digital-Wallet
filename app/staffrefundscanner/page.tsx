import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import StaffRefundScanner from "@/components/pages/StaffRefundScanner";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <StaffRefundScanner />
    </Layout>
  );
}