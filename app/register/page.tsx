import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import Register from "@/components/pages/Register";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <Register />
    </Layout>
  );
}