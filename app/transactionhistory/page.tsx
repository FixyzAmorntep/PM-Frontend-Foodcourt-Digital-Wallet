import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import TransactionHistory from "@/components/pages/TransactionHistory";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <TransactionHistory />
    </Layout>
  );
}