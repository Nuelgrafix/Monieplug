import LandingHeader from '@/components/Landingpage/Header';
import FooterCTA from '@/components/Landingpage/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingHeader />
      <main className="pt-16"> {/* Account for fixed header */}
        {children}
      </main>
      <FooterCTA />
    </>
  );
}