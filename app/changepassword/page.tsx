import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import ChangePassword from "@/components/pages/ChangePassword";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <ChangePassword />
    </Layout>
  );
}