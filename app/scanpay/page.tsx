import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import ScanPay from "@/components/pages/ScanPay";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <ScanPay />
    </Layout>
  );
}