import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import StaffDashboard from "@/components/pages/StaffDashboard";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <StaffDashboard />
    </Layout>
  );
}