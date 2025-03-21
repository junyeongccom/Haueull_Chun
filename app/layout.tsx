import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./styles/globals.css";
import { Providers } from './providers'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--poppins",
});

export const metadata: Metadata = {
  title: "Hoobank",
  description: "The Next Generation Banking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${poppins.variable} font-pretendard`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
