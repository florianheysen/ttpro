"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { MoreHorizontal } from "lucide-react";
import { PersonIcon, CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function handleCopyID(id: string) {
    navigator.clipboard.writeText(id);
    toast("Identifiant copié dans le presse papier");
}

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: "NOM",
    },
    {
        accessorKey: "city",
        header: "VILLE",
    },
    {
        accessorKey: "phone_fixe",
        header: "TEL",
    },
    {
        accessorKey: "phone_port",
        header: "PORTABLE",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const client = row.original;
            return (
                <div className="flex flex-col items-end pr-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open actions</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/clients/${client._id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <PersonIcon className="mr-2" /> Modifier le client
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopyID(client._id)}>
                                <CopyIcon className="mr-2" /> Copier l&apos;identifiant
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
