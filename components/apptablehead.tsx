"use client"

import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import SellerForm from "./form/sellerForm";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { revalidatePath } from 'next/cache'  

interface AppTableHeadProps {
    title: string;
    currentPage: string;
    btnLabel: string;
    btnLink?: string;
    count: number;
}

function AppTableHead({ title, currentPage, btnLabel, btnLink, count }: AppTableHeadProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false)

    const formSchema = z.object({
        name: z.string().describe("Nom"),
    });

    const handleSubmit = async (seller: any) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sellers/insertOne`, {
            method: "POST",
            headers: {
                Accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ seller: seller }),
        });
        
        setIsOpen(false)
        window.location.reload();
    };
    
    return (
        <div className="flex justify-between items-end">
            <div className="flex flex-col gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">{title}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                <span>{currentPage}</span>
                                <Badge className="ml-2 rounded font-normal" variant="outline">
                                    {count === 0 ? "—" : count}
                                </Badge>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-3xl font-semibold">{title}</h1>
            </div>
            {btnLink ? (
                <Button variant="outline" asChild>
                    <Link href={btnLink}> <PlusIcon className="mr-2 h-4 w-4" /> {btnLabel}</Link>
                </Button>
            ): (
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline">
                            <PlusIcon className="mr-2 h-4 w-4" /> {btnLabel}
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                        <SheetTitle>{btnLabel}</SheetTitle>
                        <div className="mt-8" />
                        <SellerForm handleSubmit={handleSubmit} formSchema={formSchema} btnLabel="Créer le vendeur" />
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
}

export default React.memo(AppTableHead);
