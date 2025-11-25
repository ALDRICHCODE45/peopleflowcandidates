import { Poppins } from "next/font/google";
import "./custom.css";
import LenisScroll from "@/features/Landing/components/lenis-scroll";
import Navbar from "@/features/Landing/components/Navbar";
import Footer from "@/features/Landing/components/Footer";
import { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "agentix - PrebuiltUI",
  description:
    "Agentix is a prebuilt UI template for AI-powered SaaS applications.",
  appleWebApp: {
    title: "agentix",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LenisScroll />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
