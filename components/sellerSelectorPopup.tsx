import { useState, useEffect } from 'react'
import useSWR from 'swr'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Button } from "@/components/ui/button"

interface ISellerSelectorPopupProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedSeller: string
  setSelectedSeller: React.Dispatch<React.SetStateAction<string>>
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function SellerSelectorPopup({ isOpen, selectedSeller, setIsOpen, setSelectedSeller }: ISellerSelectorPopupProps) {
  const { data: sellers } = useSWR('/api/sellers', fetcher);
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className='w-[250px] text-left' variant="outline">{selectedSeller === "" ? 'Choisir un vendeur' : selectedSeller}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Prêt à prendre la commande ?</AlertDialogTitle>
          <AlertDialogDescription>
            Veuillez choisir le vendeur associé à cette commande ci-dessous afin de poursuivre la saisie.
          </AlertDialogDescription>
        </AlertDialogHeader>
        { !sellers ? 'Chargement...' :
          <RadioGroup defaultValue={selectedSeller} onValueChange={(value) => setSelectedSeller(value)}>
            {sellers.map((vendeur: any) => (
                <div key={vendeur._id} className="flex items-center bg-gray-100 rounded pl-4">
                  <RadioGroupItem value={vendeur.name} id={vendeur._id} />
                  <Label className='w-full h-full px-4 py-4 cursor-pointer' htmlFor={vendeur._id}>{vendeur.name}</Label>
                </div>
              ))}
          </RadioGroup> 
        }
        <AlertDialogFooter>
          <AlertDialogAction>Continuer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
