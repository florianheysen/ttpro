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
import { fetcher } from "@/lib/utils";
import AppTableHead from "@/components/apptablehead";

function Orders() {
    const category = "meal-cold";

    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    const { data } = useSWR(
        `${process.env.NEXT_PUBLIC_URL}/api/meals/table?page=${page}&category=${category}`,
        fetcher
    );

    useEffect(() => {
        if (data) {
            setPageCount(data.pagination.pageCount);
        }
    }, [data]);

    const test = Array.from({ length: 10 }, (_, index) => index + 1);

    if (!data)
        return (
            <Appshell>
                <AppTableHead
                    title="Plats froids"
                    currentPage="Liste"
                    btnLabel="Nouveau plat"
                    btnLink="/meal/create/cold"
                    count={0}
                />
                <TableLoading columns={columns} data={test} />
                <div className="flex items-center justify-end space-x-2 py-4">
                    <DataTablePaginationLoading />
                </div>
                <Toaster closeButton />
            </Appshell>
        );

    return (
        <Appshell>
            <AppTableHead
                title="Plats froids"
                currentPage="Liste"
                btnLabel="Nouveau plat"
                btnLink="/meal/create/cold"
                count={data.pagination.count}
            />
            <DataTable columns={columns} data={data.meals} />
            <div className="flex items-center justify-end space-x-2 py-4">
                <DataTablePagination page={page} setPage={setPage} pageCount={pageCount} />
            </div>
            <Toaster closeButton />
        </Appshell>
    );
}

export default Orders;
