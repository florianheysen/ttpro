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
import { Button } from "@/components/ui/button";

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

    if (data.length === 0)
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
                            Listing mayonnaise du {format(new Date(from), "dd LLL y", { locale: fr })}{" "}
                            {to && "au " + format(new Date(to), "dd LLL y", { locale: fr })}
                        </h1>
                    </div>
                </div>
                <p className="mb-4">Aucun élément trouvé sur cet intervalle de dates.</p>
                <Link href="/reports/">
                    <Button variant="secondary">Retour</Button>
                </Link>
            </Appshell>
        );

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
                        Listing mayonnaise du {format(new Date(from), "dd LLL y", { locale: fr })}{" "}
                        {to ? "au " + format(new Date(to), "dd LLL y", { locale: fr }) : "à maintenant"}
                    </h1>
                </div>
            </div>
            <PDFViewer width="100%" height="700px">
                <Document
                    title={`Listing mayonnaise du ${format(new Date(from), "dd LLL y", { locale: fr })} ${" "}
                        ${to ? "au " + format(new Date(to), "dd LLL y", { locale: fr }) : "à maintenant"}`}
                >
                    <Page wrap style={styles.page}>
                        <View style={styles.title}>
                            <Text>
                                Listing mayonnaise du {format(new Date(from), "dd LLL y", { locale: fr })}{" "}
                                {to ? "au " + format(new Date(to), "dd LLL y", { locale: fr }) : "à maitenant"}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.row}>{data.totalPots.veryLarge} x Très grand pot 800g</Text>
                            <Text style={styles.row}>{data.totalPots.large} x Grand pot 550g</Text>
                            <Text style={styles.row}>{data.totalPots.medium} x Moyen pot 300g</Text>
                            <Text style={styles.row}>{data.totalPots.small} x Petit pot 100g</Text>
                        </View>
                        <Text
                            style={styles.pagination}
                            render={({ pageNumber, totalPages }) =>
                                `Listing mayonnaise du ${format(new Date(from), "dd LLL y", { locale: fr })} ${
                                    to ? "au " + format(new Date(to), "dd LLL y", { locale: fr }) : "à maintenant"
                                } | ${pageNumber} / ${totalPages}`
                            }
                            fixed
                        />
                    </Page>
                </Document>
            </PDFViewer>
            <Link href="/reports/">
                <Button className="mt-6" variant="secondary">
                    Retour
                </Button>
            </Link>
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
        paddingBottom: "0px",
        gap: "4px",
        fontSize: "12px",
    },
});

export default PrintGlobal;
