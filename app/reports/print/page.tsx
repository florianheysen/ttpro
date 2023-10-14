"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import LoadingScreen from "@/components/loadingScreen";
import Appshell from "@/components/appshell";

function PrintPage() {
    const { get: getParam } = useSearchParams();
    const target = getParam("target");
    const from = getParam("from");
    const to = getParam("to");

    const { data } = useSWR(
        `${process.env.NEXT_PUBLIC_URL}/api/reports/${target}?from=${from}${to ? `&to=${to}` : ""}`,
        fetcher
    );

    console.log(data);

    if (!data) return <LoadingScreen />;

    return <Appshell>Coucou</Appshell>;
}

export default PrintPage;
