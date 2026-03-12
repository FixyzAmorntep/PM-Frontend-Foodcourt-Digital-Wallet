import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import MerchantDashboard from "@/components/pages/MerchantDashboard";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <MerchantDashboard />
    </Layout>
  );
}