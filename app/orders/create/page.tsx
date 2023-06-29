"use client"

import * as React from "react"
import { setLocal } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Appshell from "@/components/appshell"
import ClientSelector from "@/components/clientSelector"
import { SellerSelectorPopup } from "@/components/sellerSelectorPopup"

export default function CreateOrder() {
  const [order, setOrder] = React.useState({
    seller: null,
    client: null,
  });

  const handleChange = (field: string, newValue: unknown) => {
    setOrder((prevState: any) => ({
      ...prevState,
      [field]: newValue,
    }));
  };

  const handleSubmit = () => {
    console.log(order);
  }

  React.useEffect(() => {setLocal("order", JSON.stringify(order))}, [order]);

  return (
    <Appshell>
      <h1 className="text-3xl font-semibold">Nouvelle commande</h1>
      <div className="flex flex-col gap-1 text-sm font-semibold py-4">
        <span>Client</span>
        <div className="flex gap-2">
          <ClientSelector order={order} handleChange={handleChange} />
          <Button variant="outline">Nouveau client</Button>
        </div>
        <br /><br />
        <span>Vendeur</span>
        <SellerSelectorPopup order={order} handleChange={handleChange} />
      </div>
      <br />
      <Button onClick={handleSubmit}>Enregistrer</Button>
    </Appshell>
  )
}
