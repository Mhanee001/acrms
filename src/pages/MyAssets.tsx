import { Layout } from "@/components/Layout";
import { AssetManager } from "@/components/AssetManager";

const MyAssets = () => {
  return (
    <Layout showSidebar={true}>
      <div className="p-6">
        <AssetManager />
      </div>
    </Layout>
  );
};

export default MyAssets;