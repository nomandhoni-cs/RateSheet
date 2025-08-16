import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { Background } from "@/components/Background";

const lora = Lora({
  variable: "--font-lora-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RateSheet - Modern Rate Management",
  description: "Streamline your rate sheet management with our modern platform",
  keywords: ["rate sheet", "management", "platform"],
  authors: [{ name: "RateSheet Team" }],
  openGraph: {
    title: "RateSheet",
    description: "Modern Rate Management Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" suppressHydrationWarning>
        <body className={`${lora.variable} ${inter.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <div className="relative min-h-screen w-full overflow-x-hidden">
                {/* Main Content */}
                <div className="relative z-10 flex flex-col min-h-screen">
                  <Navbar />

                  <main className="flex-1 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      {children}
                    </div>
                  </main>

                  {/* Optional Footer */}
                  <footer className="relative z-10 border-t border-border/40 bg-background/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                      <p className="text-center text-sm text-muted-foreground">
                        © 2025 RateSheet. All rights reserved.
                      </p>
                    </div>
                  </footer>
                </div>
              </div>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
