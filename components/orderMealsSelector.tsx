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

export default function OrderMealsSelector({order, handleChange}: {order: any, handleChange: any}) {
  const [open, setOpen] = React.useState(false)
  const [meals, setMeals]: any = React.useState([])
  const [selectedMeals, setSelectedMeals]: any = React.useState([])

  const debouncedSearch = React.useRef(
    debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
      try{
        const res = await fetch('http://localhost:3000/api/meals', {
          method: 'POST',
          headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: e.target.value })
        })
  
        const meals = await res.json();
  
        setMeals(meals)
      } catch(e) {
        console.log(e)
      }
    }, 200)
  ).current;

  const addMeal = (meal: any) => {
    const order = JSON.parse(localStorage.getItem('ttpro.order') || '');

    const meals = order.meals;

    const existingMealIndex = meals.findIndex((m: any) => m.mealId === meal.mealId);

    if (existingMealIndex !== -1) {
      toast.error('Le plat '+ meal.mealCode + ' a déjà été ajouté')
    } else {
        const formattedMeal = {
            mealId: meal.mealId,
            code: meal.mealCode,
            name: meal.mealName,
            price: meal.mealPrice,
            selectedIngredients: meal.ingredients,
            qty: 1,
            comment: ""
        };
        meals.push(formattedMeal);
    }

    setSelectedMeals(meals);
}


  // Écoute les modifications et utilise le handleChange pour envoyer les plats séléectionnés à la page parent.
   React.useEffect(() => {handleChange("meals", selectedMeals) }, [selectedMeals, setSelectedMeals])

  return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {order?.meal?.mealName ? order?.meal?.mealName : "Choisir un plat"}
              <CaretSortIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <Input className="" onChange={(e) => debouncedSearch(e)} placeholder="Rechercher..." />
              <CommandEmpty>Aucun plat trouvé.</CommandEmpty>
              <CommandGroup>
                {meals.map((meal: any) => (
                  <CommandItem
                    key={meal?._id}
                    onSelect={() => {
                      addMeal(meal);
                      setOpen(false)
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        order?.meal?._id === meal?._id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {meal?.mealName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
  )
}
