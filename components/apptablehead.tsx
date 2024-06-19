import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { CardStackPlusIcon } from "@radix-ui/react-icons";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "./ui/badge";

interface AppTableHeadProps {
    title: string;
    currentPage: string;
    btnLabel: string;
    btnLink: string;
    count: number;
}

function AppTableHead({ title, currentPage, btnLabel, btnLink, count }: AppTableHeadProps) {
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
            <Button variant="outline" asChild>
                <Link href={btnLink}>
                    <CardStackPlusIcon className="mr-2 h-4 w-4" /> {btnLabel}
                </Link>
            </Button>
        </div>
    );
}

export default React.memo(AppTableHead);
