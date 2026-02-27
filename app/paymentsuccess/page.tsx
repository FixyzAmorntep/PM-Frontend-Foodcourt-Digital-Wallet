import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import PaymentSuccess from "@/components/pages/PaymentSuccess";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <PaymentSuccess />
    </Layout>
  );
}