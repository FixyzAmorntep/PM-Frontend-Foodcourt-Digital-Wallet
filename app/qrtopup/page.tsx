import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import QRTopup from "@/components/pages/QRTopup";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <QRTopup />
    </Layout>
  );
}