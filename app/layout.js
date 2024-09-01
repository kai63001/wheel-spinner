import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wheel of Names | Random name picker",
  description: "Free and easy to use spinner. Used by teachers and for raffles. Enter names, spin wheel to pick a random winner. Customize look and feel, save and share wheels.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
