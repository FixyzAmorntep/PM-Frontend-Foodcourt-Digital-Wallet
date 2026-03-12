import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import StaffTopupSuccess from "@/components/pages/StaffTopupSuccess";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <StaffTopupSuccess />
    </Layout>
  );
}