export const revalidate = 60;

import { fetchStocks, fetchSignals, fetchCrypto, fetchFutures, fetchFedUpdates, fetchGeoRisk } from './lib/fetchers';
import ThreeBackground from './components/ThreeBackground';
import DashboardClient from './components/DashboardClient';

export default async function Home() {
  // Fetch all real data in parallel
  const [stocks, signals, crypto, futures, fedUpdates, geoRisk] = await Promise.all([
    fetchStocks(),
    fetchSignals(),
    fetchCrypto(),
    fetchFutures(),
    fetchFedUpdates(),
    fetchGeoRisk(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
      <ThreeBackground />
      <DashboardClient
        stocks={stocks}
        signals={signals}
        crypto={crypto}
        futures={futures}
        fedUpdates={fedUpdates}
        geoRisk={geoRisk}
      />
    </div>
  );
}
