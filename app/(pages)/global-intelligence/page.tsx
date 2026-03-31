import dynamic from 'next/dynamic';
import NavBar from '@/app/components/NavBar';
import ThreeBackground from '@/app/components/ThreeBackground';

const GlobalIntelligenceDashboard = dynamic(
  () => import('@/app/components/GlobalIntelligenceDashboard'),
    { ssr: false }
    );

    export const metadata = {
      title: 'Global Intelligence | Y.P Strategic Research',
        description: 'Real-time 3D global intelligence map — geopolitical risk zones, live stock data, and defence-tech tracking.',
        };

        export default function GlobalIntelligencePage() {
          return (
              <>
                    <ThreeBackground />
                          <div className="relative z-10">
                                  <div className="max-w-[1400px] mx-auto px-5 pt-6 pb-4">
                                            <NavBar />
                                                    </div>
                                                            <GlobalIntelligenceDashboard />
                                                                  </div>
                                                                      </>
                                                                        );
                                                                        }
