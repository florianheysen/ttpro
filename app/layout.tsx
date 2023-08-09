import './globals.css'

import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from "@/components/themeProvider"
import { frFR } from "@clerk/localizations";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={frFR}>
        <html lang="fr" className="h-full">
          <body className="h-full">
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
  )
}
