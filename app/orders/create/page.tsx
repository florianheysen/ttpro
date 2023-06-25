"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import Appshell from "@/components/appshell"
import ClientSelector from "@/components/clientSelector"
import { SellerSelectorPopup } from "@/components/sellerSelectorPopup"

export default function CreateOrder() {
  const [selectedClient, setSelectedClient] = React.useState({});

  const [selectedSeller, setSelectedSeller] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Appshell title="Commandes">
      <h1 className="text-3xl font-semibold">Nouvelle commande</h1>
      <div className="flex flex-col gap-1 text-sm font-semibold py-4">
        <span>Client</span>
        <div className="flex gap-2">
          <ClientSelector selectedClient={selectedClient} setSelectedClient={setSelectedClient} />
          <Button variant="outline">Nouveau client</Button>
        </div>
        <br /><br />
        <span>Vendeur</span>
        <SellerSelectorPopup isOpen={isOpen} setIsOpen={setIsOpen} selectedSeller={selectedSeller} setSelectedSeller={setSelectedSeller} />
      </div>
    </Appshell>
  )
}
