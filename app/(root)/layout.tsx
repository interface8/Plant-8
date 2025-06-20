import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";

export const metadata = {
  title: "FAM 8",
  description: "FARM IT!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  );
}
