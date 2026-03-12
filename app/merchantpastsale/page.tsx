import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import MerchantPastSale from "@/components/pages/MerchantPastSale";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <MerchantPastSale/>
    </Layout>
  );
}