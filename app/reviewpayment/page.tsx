import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import ReviewPayment from "@/components/pages/ReviewPayment";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <ReviewPayment />
    </Layout>
  );
}