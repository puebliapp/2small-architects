import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UIProvider } from "@/context/UIContext";
import AboutDrawer from "@/components/AboutDrawer";
import CustomCursor from "@/components/CustomCursor";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "2 Small Architects",
  description: "Portfolio of 2 Small Architects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <UIProvider>
          <CustomCursor />
          <Header />
          <AboutDrawer />
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
          <Footer />
        </UIProvider>
      </body>
    </html>
  );
}
