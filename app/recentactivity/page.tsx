import Layout from "@/components/layout/Layout"; // ดึงกรอบมือถือมา
import RecentActivity from "@/components/pages/Recentactivity";   // ดึง UI หน้าเติมเงินมา

export default function Page() {
  return (
    <Layout>
      <RecentActivity/>
    </Layout>
  );
}