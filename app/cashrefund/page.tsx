import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import CashRefund from "@/components/pages/CashRefund";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <CashRefund />
    </Layout>
  );
}