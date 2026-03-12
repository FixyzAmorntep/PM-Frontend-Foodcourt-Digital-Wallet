import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import MerchantReceivePayment from "@/components/pages/MerchantReceivePayment";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <MerchantReceivePayment/>
    </Layout>
  );
}