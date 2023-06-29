"use client"

import * as React from "react"
import debounce from "lodash.debounce"

import { Input } from "@/components/ui/input"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

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

export default function ClientSelector({order, handleChange}: {order: any, handleChange: any}) {
  const [open, setOpen] = React.useState(false)
  const [clients, setClients]: any = React.useState([])

  const debouncedSearch = React.useRef(
    debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
      try{
        const res = await fetch('http://localhost:3000/api/clients', {
          method: 'POST',
          headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: e.target.value })
        })
  
        const clients = await res.json();
  
        setClients(clients)
      } catch(e) {
        console.log(e)
      }
    }, 200)
  ).current;

  return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[250px] justify-between"
            >
              {order?.client?.name ? order?.client?.name.toUpperCase() : "Choisir un client"}
              <CaretSortIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <Input className="" onChange={(e) => debouncedSearch(e)} placeholder="Rechercher..." />
              <CommandEmpty>Aucun client trouvé.</CommandEmpty>
              <CommandGroup>
                {clients.map((client: any) => (
                  <CommandItem
                    key={client?._id}
                    onSelect={() => {
                      handleChange('client', client?._id === order?.client?._id ? "" : client)
                      setOpen(false)
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        order?.client?._id === client?._id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {client?.name.toUpperCase()}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
  )
}
