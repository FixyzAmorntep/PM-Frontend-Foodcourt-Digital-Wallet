import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import Login from "@/components/pages/Login";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <Login />
    </Layout>
  );
}