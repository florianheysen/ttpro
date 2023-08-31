"use client";

import * as React from "react";
import debounce from "lodash.debounce";

import { Input } from "@/components/ui/input";
import { CaretSortIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function OrderVracSelector({ order, handleChange }: { order: any; handleChange: any }) {
    const [open, setOpen] = React.useState(false);
    const [vracs, setVracs]: any = React.useState([]);

    const debouncedSearch = React.useRef(
        debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/vrac`, {
                    method: "POST",
                    headers: {
                        Accept: "application.json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: e.target.value }),
                });

                const meals = await res.json();

                setVracs(meals);
            } catch (e) {
                console.log(e);
            }
        }, 200)
    ).current;

    const addVrac = (ingredient: any) => {
        const currentVrac = order.vrac;

        const newVrac = {
            _id: ingredient._id,
            code: "VRAC",
            name: ingredient.name,
            price: ingredient.price,
            qty: 1,
            comment: "",
            unit: {
                name: "pièce",
                symbol: "pc",
            },
        };

        currentVrac.push(newVrac);
        handleChange("vrac", currentVrac);
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
                        {vracs.map((ingredient: any) => (
                            <CommandItem
                                key={ingredient?._id}
                                onSelect={() => {
                                    addVrac(ingredient);
                                    setOpen(false);
                                }}
                            >
                                {ingredient?.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
