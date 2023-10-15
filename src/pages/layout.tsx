import { Inter } from "next/font/google";
import Navbar from "../app/components/navbar";
import Footer from "../app/components/footer";
import { useTranslation } from "react-i18next";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar actionTitle={t("navBarButton")} actionUrl="/retrieve" />
        {children}
        <Footer />
      </body>
    </html>
  );
}
