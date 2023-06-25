"use client"

import { ColumnDef } from "@tanstack/react-table"

import { MoreHorizontal } from "lucide-react"
import { FileTextIcon, CardStackMinusIcon, PersonIcon, CopyIcon, CaretSortIcon, } from "@radix-ui/react-icons"

import moment from "moment"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Order = {
  _id: string;
  num: string;
  created_at: string;
  updated_at: string;
  seller: string;
  client: {
    name: string;
    phone_port: string;
    phone_fixe: string | null;
    city: string;
    postal_code: string;
  };
  consigne: boolean;
  price: string;
  deposit: string;
  totalMayo: string;
  meals: any[];
  specialMeals: {
    finalPrice: number;
    personnes: string;
    qty: number;
    selectedIngredients: {
      id: string;
      name: string;
      price: string;
      qty: string | number;
    }[];
  }[];
  vrac: any[];
};

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "num",
    header: "Numéro",
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          className="-ml-4"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          className="-ml-4"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Créé le
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const created_at = row.getValue("created_at")  || '';
      const formatted = moment(created_at).format("DD/MM/YYYY")
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "seller",
    header: "Vendeur",
  },
  {
    accessorKey: "price",
    header: "Total",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(price)
      return <div>{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original
 
      return (
        <DropdownMenu>
          <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open actions</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Actions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={() => console.log(order._id)}
            >
              <CardStackMinusIcon className="mr-2" /> Voir la commande
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={() => console.log(order._id)}
            >
              <FileTextIcon className="mr-2" /> Imprimer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={() => console.log(order.clientId)}
            >
                <PersonIcon className="mr-2" /> Voir le client
              </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigator.clipboard.writeText(order._id)}
            >
              <CopyIcon className="mr-2" /> Copier l&apos;identifiant
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
