import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import MerchantActivity from "@/components/pages/MerchantActivity";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <MerchantActivity />
    </Layout>
  );
}