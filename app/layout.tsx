import './globals.css'
import { Toaster } from "@/components/ui/toaster"

import { ClerkProvider } from '@clerk/nextjs';
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
            {children}
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
  )
}
