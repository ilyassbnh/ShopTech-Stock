import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import Sidebar from "@/components/Sidebar"; // <-- Import de ta Sidebar

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gestion de Stock",
  description: "ShopTech Studio App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning={true}>
      <body className={`${inter.className} bg-slate-50 text-slate-800`} suppressHydrationWarning={true}>
        <ReduxProvider>

          <div className="flex min-h-screen">
            {/* 1. La Sidebar */}
            <Sidebar />

            {/* 2. La zone de contenu principal */}
            <main className="flex-1 ml-64 p-8 bg-white">
              {children}
            </main>
          </div>

        </ReduxProvider>
      </body>
    </html>
  );
}