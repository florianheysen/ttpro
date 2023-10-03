"use client";

import Appshell from "@/components/appshell";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Toaster } from "sonner";
import { DataTablePagination } from "@/components/ui/datatable-pagination";
import { TableLoading } from "./table-loading";
import { DataTablePaginationLoading } from "@/components/ui/datatable-pagination-loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CardStackPlusIcon } from "@radix-ui/react-icons";
import { fetcher } from "@/lib/utils";

function Orders() {
    const pageName = "Plateaux PL1 à PL5"
    const category = "meal-special"

    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    const { data } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/mealsTable?page=${page}&category=${category}`, fetcher);

    useEffect(() => {
        if (data) {
            setPageCount(data.pagination.pageCount);
        }
    }, [data]);

    const test = Array.from({ length: 10 }, (_, index) => index + 1);

    if (!data)
        return (
            <Appshell>
                <div className="flex justify-between pb-8">
                    <h1 className="text-3xl font-semibold">{pageName}</h1>
                    <Button variant="outline" asChild>
                        <Link href="/orders/create">
                            <CardStackPlusIcon className="mr-2 h-4 w-4" /> Nouveau plat
                        </Link>
                    </Button>
                </div>
                <TableLoading columns={columns} data={test} />
                <div className="flex items-center justify-end space-x-2 py-4">
                    <DataTablePaginationLoading />
                </div>
                <Toaster closeButton />
            </Appshell>
        );

    return (
        <Appshell>
            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold">{pageName}</h1>
                <Button variant="outline" asChild>
                    <Link href="/orders/create">
                        <CardStackPlusIcon className="mr-2 h-4 w-4" /> Nouveau plat
                    </Link>
                </Button>
            </div>
            <DataTable columns={columns} data={data.meals} />
            <div className="flex items-center justify-end space-x-2 py-4">
                <DataTablePagination page={page} setPage={setPage} pageCount={pageCount} />
            </div>
            <Toaster closeButton />
        </Appshell>
    );
}

export default Orders;
