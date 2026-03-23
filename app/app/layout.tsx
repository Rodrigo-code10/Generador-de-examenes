import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google"; // Usamos las fuentes de tu diseño
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Quiz App - Login",
  description: "Ingresa para continuar tu racha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Añadimos la clase 'dark' para que coincida con tu diseño
    <html lang="es" className={`${inter.variable} ${manrope.variable} dark antialiased`}>
      <head>
        {/* Importante para que funcionen los iconos de tu diseño */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" 
        />
      </head>
      <body className="bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}