"use client";

import * as React from "react";
import debounce from "lodash.debounce";

import { Input } from "@/components/ui/input";
import { CaretSortIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toaster, toast } from "sonner";

export function MealIngredientSelector({ meal, handleChange }: { meal: any; handleChange: any }) {
    const [open, setOpen] = React.useState(false);
    const [ingredients, setIngredients]: any = React.useState([]);

    const debouncedSearch = React.useRef(
        debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ingredients/search`, {
                    method: "POST",
                    headers: {
                        Accept: "application.json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: e.target.value }),
                });

                const meals = await res.json();

                setIngredients(meals);
            } catch (e) {
                console.log(e);
            }
        }, 200)
    ).current;

    const addIngredient = (ingredient: any) => {
        const currentIngredients = meal.ingredients;

        const existingIngredient = currentIngredients.find((ing: any) => ing.id === ingredient._id);

        if (existingIngredient) {
            toast.error(`'${ingredient.name}' a déjà été ajouté`);
        } else {
            const newIngredient = {
                id: ingredient._id,
                name: ingredient.name,
                price: ingredient.price,
                qty: 1,
                units: {
                    name: ingredient.unit.name,
                    symbol: ingredient.unit.symbol,
                },
            };

            currentIngredients.push(newIngredient);
            handleChange("ingredients", currentIngredients);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[250px] justify-between">
                    Choisir un ingrédient
                    <CaretSortIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <Input className="" onChange={(e) => debouncedSearch(e)} placeholder="Rechercher..." />
                    <CommandEmpty>Aucun ingrédient trouvé.</CommandEmpty>
                    <CommandGroup>
                        {ingredients.map((ingredient: any) => (
                            <CommandItem
                                key={ingredient?._id}
                                onSelect={() => {
                                    addIngredient(ingredient);
                                    setOpen(false);
                                }}
                            >
                                {ingredient?.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
            <Toaster richColors closeButton />
        </Popover>
    );
}
