import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import StaffScanner from "@/components/pages/StaffScanner";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <StaffScanner />
    </Layout>
  );
}