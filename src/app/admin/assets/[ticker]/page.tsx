import { integratedAssets, pendingAssets } from "../data";
import AssetAdminPage from "./AssetAdminPage";

export default async function Page({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const asset = [...integratedAssets, ...pendingAssets].find(
    (a) => a.ticker.toLowerCase() === ticker.toLowerCase(),
  );
  if (!asset) {
    return (
      <div className="p-6 md:p-10">
        <p>Asset not found.</p>
      </div>
    );
  }
  return <AssetAdminPage asset={asset} />;
}
