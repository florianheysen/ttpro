"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import LoadingScreen from "@/components/loadingScreen";
import Appshell from "@/components/appshell";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Page, Text, View, Document, PDFViewer, StyleSheet } from "@react-pdf/renderer";
import Link from "next/link";

function PrintGlobal() {
    const { get: getParam } = useSearchParams();
    const target = getParam("target");
    const from: any = getParam("from");
    const to: any = getParam("to");

    const { data } = useSWR(
        `${process.env.NEXT_PUBLIC_URL}/api/reports/${target}?from=${from}${to ? `&to=${to}` : ""}`,
        fetcher
    );

    if (!data) return <LoadingScreen />;

    return (
        <Appshell>
            <div className="flex justify-between items-end mb-8">
                <div className="flex flex-col gap-4">
                    <p className="flex gap-2 text-sm">
                        <span className="opacity-40">Comptes rendus</span>
                        <span className="opacity-40">/</span>
                        <Link href="/reports" className="opacity-40 hover:opacity-80 transition-opacity">
                            Création
                        </Link>
                        <span className="opacity-40">/</span>
                        <span className="font-medium">Impression</span>
                    </p>
                    <h1 className="text-3xl font-semibold">
                        Listing global du {format(new Date(from), "dd LLL y", { locale: fr })} au{" "}
                        {format(new Date(to), "dd LLL y", { locale: fr })}
                    </h1>
                </div>
            </div>
            <PDFViewer width="100%" height="700px">
                <Document
                    title={`Listing global du ${format(new Date(from), "dd LLL y", { locale: fr })} au ${" "}
                        ${format(new Date(to), "dd LLL y", { locale: fr })}`}
                >
                    <Page wrap style={styles.page}>
                        <View style={styles.title}>
                            <Text>
                                Listing global du {format(new Date(from), "dd LLL y", { locale: fr })} au{" "}
                                {format(new Date(to), "dd LLL y", { locale: fr })}
                            </Text>
                        </View>
                        {data.map((item: any) => (
                            <View key={item.name} style={styles.row}>
                                <Text style={styles.qty}>{item.qty}</Text>
                                <Text style={styles.unit}>{item.unit}</Text>
                                <Text style={styles.name}>{item.name}</Text>
                            </View>
                        ))}
                        <Text
                            style={styles.pagination}
                            render={({ pageNumber, totalPages }) =>
                                `Listing global du ${format(new Date(from), "dd LLL y", { locale: fr })} au ${format(
                                    new Date(to),
                                    "dd LLL y",
                                    { locale: fr }
                                )} | ${pageNumber} / ${totalPages}`
                            }
                            fixed
                        />
                    </Page>
                </Document>
            </PDFViewer>
        </Appshell>
    );
}

const styles = StyleSheet.create({
    page: {
        padding: "20px 20px 30px 20px",
    },
    pagination: {
        position: "absolute",
        fontSize: "10px",
        bottom: "10px",
        right: "10px",
    },
    title: {
        fontSize: "16px",
        paddingBottom: "20px",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        paddingBottom: "2px",
    },
    qty: {
        fontSize: "12px",
        width: "35px",
        textAlign: "right",
        paddingBottom: "2px",
        borderBottom: "1px solid lightgrey",
    },
    unit: {
        fontSize: "12px",
        padding: "0px 10px",
        paddingBottom: "2px",
        borderBottom: "1px solid lightgrey",
    },
    name: {
        fontSize: "12px",
        width: "100%",
        paddingBottom: "2px",
        borderBottom: "1px solid lightgrey",
    },
});

export default PrintGlobal;
