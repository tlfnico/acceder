import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACCEDER - Recursero Digital de Accesibilidad",
  description:
    "Plataforma pública para consultar recursos, servicios, trámites y derechos de personas con discapacidad, sus familias y profesionales.",
};

// Forzar renderizado dinámico en tiempo real para reflejar cambios de base de datos inmediatamente
export const dynamic = "force-dynamic";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main id="contenido-principal" className="main-container">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
