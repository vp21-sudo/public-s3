import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Public S3",
  description: "An app to upload images to Amazon S3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer
          theme="light"
          hideProgressBar
          limit={3}
        />
      </body>
    </html>
  );
}
