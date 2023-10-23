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
import React from "react";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

function Orders() {
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [searchResult, setSearchResult]: any = useState(null);

    const { data } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/clients/table?page=${page}`, fetcher);

    const debouncedSearch = React.useRef(
        debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/clients/search`, {
                    method: "POST",
                    headers: {
                        Accept: "application.json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: e.target.value }),
                });

                const clients = await res.json();

                setSearchResult(clients);
            } catch (e) {
                console.log(e);
            }
        }, 200)
    ).current;

    const clearSearch = () => {
        window.location.reload();
    };

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
                    title="Clients"
                    currentPage="Liste"
                    btnLabel="Nouveau client"
                    btnLink="/clients/create"
                    count={0}
                />
                <div className="flex w-80 gap-3 mt-2">
                    <Input disabled id="search" placeholder="Rechercher..." />
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
            <AppTableHead
                title="Clients"
                currentPage="Liste"
                btnLabel="Nouveau client"
                btnLink="/clients/create"
                count={data.pagination.count}
            />
            <div className="flex w-80 gap-3 mt-2">
                <Input onChange={(e) => debouncedSearch(e)} id="search" placeholder="Rechercher..." />
                {searchResult && (
                    <Button onClick={clearSearch} variant="outline" className="py-0 px-2">
                        <span className="sr-only">Supprimer</span>
                        <Cross2Icon className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTable columns={columns} data={searchResult ?? data.clients} />
            <div className="flex items-center justify-end space-x-2 py-4">
                <DataTablePagination page={page} setPage={setPage} pageCount={pageCount} />
            </div>
            <Toaster closeButton />
        </Appshell>
    );
}

export default Orders;
