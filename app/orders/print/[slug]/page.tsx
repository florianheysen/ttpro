"use client"

import Appshell from "@/components/appshell"
import { Skeleton } from "@/components/ui/skeleton";
import {
  Page,
  Text,
  Document,
  PDFViewer,
} from "@react-pdf/renderer";
import React from "react"

export default function Pagee({ params }: { params: { slug: string } }) {
  const [isClient, setIsClient] = React.useState(false)
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const PDF = () => {
    return (
      <Document>
        <Page>
          <Text>Mon ID: {params.slug}</Text>
        </Page>
      </Document>
    )
  }


    return (
      <Appshell>
        <h1 className="text-3xl font-semibold pb-4">Impression</h1>
        {isClient ? (
          <>
          <PDFViewer width="100%" height="700px">
            <PDF />
          </PDFViewer>
         {/* <PDFDownloadLink 
          document={PDF2} 
          fileName="resume.pdf"
        > 
          {({ loading }) => (loading ? 'Chargement du document...' : 'Télécharger le bon de commande')}
        </PDFDownloadLink>  */}
      </>
      ): <Skeleton className="w-full h-[700px]" />}
      </Appshell>
    ) 
  }