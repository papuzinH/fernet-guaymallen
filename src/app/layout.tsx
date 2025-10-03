import type { Metadata } from "next";
import { Inter, Montserrat, Bebas_Neue } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import ModernNavbar from "@/components/ui/modern-navbar";
import { TournamentProvider } from "@/contexts/TournamentContext";
import { MatchDataProvider } from "@/contexts/MatchDataContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Fernet con Guaymallén - Fútbol Argentino",
  description: "Pasión por el fútbol, orgullo mendocino. Seguimiento de partidos, estadísticas y rankings del club Fernet con Guaymallén.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${montserrat.variable} ${bebasNeue.variable} antialiased`}
      >
        <TournamentProvider>
          <MatchDataProvider>
            <ModernNavbar />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#0D1B4C',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                },
              }}
            />
          </MatchDataProvider>
        </TournamentProvider>
      </body>
    </html>
  );
}
