import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import Settings from "@/components/pages/Settings";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <Settings />
    </Layout>
  );
}