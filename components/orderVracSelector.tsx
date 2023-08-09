"use client"

import * as React from "react"
import debounce from "lodash.debounce"

import { Input } from "@/components/ui/input"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { toast } from 'sonner'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function OrderVracSelector({order, handleChange}: {order: any, handleChange: any}) {
  const [open, setOpen] = React.useState(false)
  const [vracs, setVracs]: any = React.useState([])
  const [selectedVracs, setSelectedVracs]: any = React.useState([])

  const debouncedSearch = React.useRef(
    debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
      try{
        const res = await fetch('http://localhost:3000/api/vrac', {
          method: 'POST',
          headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: e.target.value })
        })
  
        const meals = await res.json();
  
        setVracs(meals)
      } catch(e) {
        console.log(e)
      }
    }, 200)
  ).current;

  const addVrac = (ingredient: any) => {
    const order = JSON.parse(localStorage.getItem('ttpro.order') || '');

    const meals = order.meals;

    const existingMealIndex = meals.findIndex((m: any) => m._id === ingredient._id);

    if (existingMealIndex !== -1) {
      toast.error('Ingrédient ajouté')
    } else {
        const formattedVrac = {
            id: ingredient._id,
            name: ingredient.name,
            price: ingredient.price,
            unit: ingredient.unit,
        };
        meals.push(formattedVrac);
    }

    selectedVracs(meals); 
}


  // Écoute les modifications et utilise le handleChange pour envoyer les plats séléectionnés à la page parent.
/*    React.useEffect(() => {handleChange("meals", selectedMeals) }, [selectedMeals, setSelectedMeals])
 */
  return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              Choisir un ingrédient
              <CaretSortIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <Input className="" onChange={(e) => debouncedSearch(e)} placeholder="Rechercher..." />
              <CommandEmpty>Aucun ingrédient trouvé.</CommandEmpty>
              <CommandGroup>
                {vracs.map((ingredient: any) => (
                  <CommandItem
                    key={ingredient?._id}
                    onSelect={() => {
                      addVrac(ingredient);
                      setOpen(false)
                    }}
                  >
                    {ingredient?.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
  )
}
