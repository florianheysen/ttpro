"use client";

import Appshell from "@/components/appshell";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Toaster } from "sonner";
import { DataTablePagination } from "@/components/ui/datatable-pagination";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { TableLoading } from "./table-loading";
import { DataTablePaginationLoading } from "@/components/ui/datatable-pagination-loading";
import { fetcher } from "@/lib/utils";
import AppTableHead from "@/components/apptablehead";
import Head from "next/head";
import React from "react";
import { Button } from "@/components/ui/button";

function Orders() {
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [searchTerm, setSearchTerm]: any = useState(null);
    const [searchResult, setSearchResult]: any = useState(null);

    const { data } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/orders/table?page=${page}`, fetcher);

    useEffect(() => {
        const debouncedSearch = debounce(async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders/search`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ searchTerm }),
                });

                const orders = await res.json();

                setSearchResult(orders);
            } catch (error) {
                console.error(error);
            }
        }, 200);

        debouncedSearch();
    }, [searchTerm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

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
                <Head>
                    <title>Commandes | Traiteur Pro</title>
                </Head>
                <AppTableHead
                    title="Commandes"
                    currentPage="Liste"
                    btnLabel="Nouvelle commande"
                    btnLink="/orders/create"
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
                title="Commandes"
                currentPage="Liste"
                btnLabel="Nouvelle commande"
                btnLink="/orders/create"
                count={data.pagination.count}
            />
            <div className="flex w-80 gap-3 mt-2">
                <Input value={searchTerm} onChange={handleChange} id="search" placeholder="Rechercher..." />
                {searchResult && (
                    <Button onClick={clearSearch} variant="outline" className="py-0 px-2">
                        <span className="sr-only">Supprimer</span>
                        <Cross2Icon className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTable columns={columns} data={searchResult ?? data.orders} />
            <div className="flex items-center justify-end space-x-2 py-4">
                <DataTablePagination page={page} setPage={setPage} pageCount={pageCount} />
            </div>
            <Toaster closeButton />
        </Appshell>
    );
}

export default Orders;
