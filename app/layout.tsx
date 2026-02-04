import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PAM Techno - Client Progress Tracker",
    template: "%s | PAM Techno",
  },
  description:
    "Pantau progres proyek digital Anda secara real-time bersama PAM Techno. Transparansi dan kemudahan dalam satu platform.",
  keywords: [
    "PAM Techno",
    "Jasa Pembuatan Website",
    "Software House Padang",
    "Client Tracker",
    "Web Development",
    "Mobile App Development",
  ],
  authors: [{ name: "PAM Techno Team" }],
  creator: "PAM Techno",
  publisher: "PAM Techno",
  metadataBase: new URL("https://pamtrack.vercel.app"),
  openGraph: {
    title: "PAM Techno - Client Progress Tracker",
    description:
      "Pantau progres proyek digital Anda secara real-time bersama PAM Techno.",
    type: "website",
    locale: "id_ID",
    siteName: "PAM Techno Progress Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "PAM Techno - Client Progress Tracker",
    description:
      "Pantau progres proyek digital Anda secara real-time bersama PAM Techno.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "3PavpFYOOHnO0HteCsZmqoCXyYMm9gysHgQvMHtG6VY",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PAM Techno",
  url: "https://pamtrack.vercel.app",
  logo: "https://pamtrack.vercel.app/logo-pure.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+62895600077007",
    contactType: "customer service",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "border-border bg-card text-card-foreground",
            }}
          />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
