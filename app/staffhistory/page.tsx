import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import StaffHistory from "@/components/pages/StaffHistory";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <StaffHistory />
    </Layout>
  );
}