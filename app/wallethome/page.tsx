import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import WalletHome from "@/components/pages/WalletHome";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <WalletHome />
    </Layout>
  );
}