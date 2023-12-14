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

function PrintOystersMeal() {
    const { get: getParam } = useSearchParams();
    const target = getParam("target");
    const from: any = getParam("from");
    const to: any = getParam("to");

    const { data } = useSWR(
        `${process.env.NEXT_PUBLIC_URL}/api/reports/${target}?from=${from}${to ? `&to=${to}` : ""}`,
        fetcher
    );

    console.log(data);

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
                            Listing plats d&apos;huites ouvertes du {format(new Date(from), "dd LLL y", { locale: fr })}{" "}
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
                        Listing plats d&apos;huites ouvertes du {format(new Date(from), "dd LLL y", { locale: fr })}{" "}
                        {to ? "au " + format(new Date(to), "dd LLL y", { locale: fr }) : "à maintenant"}
                    </h1>
                </div>
            </div>
            <PDFViewer width="100%" height="700px">
                <Document
                    title={`Listing plats d'huites du ${format(new Date(from), "dd LLL y", { locale: fr })} ${" "}
                        ${to ? "au " + format(new Date(to), "dd LLL y", { locale: fr }) : "à maintenant"}`}
                >
                    <Page wrap style={styles.page}>
                        <View style={styles.title}>
                            <Text>
                                Listing plats d&apos;huites ouvertes du{" "}
                                {format(new Date(from), "dd LLL y", { locale: fr })}{" "}
                                {to ? "au " + format(new Date(to), "dd LLL y", { locale: fr }) : "à maitenant"}
                            </Text>
                        </View>
                        {data.map((item: any) => (
                            <View wrap={false} key={item.name} style={styles.mb}>
                                <View style={styles.row}>
                                    <Text style={styles.qty}>{item.meal_qty}×</Text>
                                    <Text style={styles.unit}>{item.meal_code}</Text>
                                    <Text style={styles.name}>{item.meal_name}</Text>
                                </View>
                                <View>
                                    {item.orders.map((order: any, index: number) => {
                                        const rowStyle: any = {
                                            backgroundColor: index % 2 === 1 ? "#f2f2f2" : "white",
                                        };

                                        return (
                                            <View style={[styles.orderlist, rowStyle]} key={order.order_code}>
                                                <Text style={styles.code}>{order.order_code}</Text>
                                                <Text style={styles.date}>{order.order_delivery_date}</Text>
                                                <Text style={styles.clientName}>{order.order_client_name}</Text>
                                                <Text style={styles.individual}>{order.order_individual_qty}</Text>
                                                <Text style={styles.comment}>{order.meal_comment}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                        <Text
                            style={styles.pagination}
                            render={({ pageNumber, totalPages }) =>
                                `Listing plats d'huites ouvertes du ${format(new Date(from), "dd LLL y", {
                                    locale: fr,
                                })} ${
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
    code: {
        fontSize: "10px",
        width: "55px",
    },
    individual: {
        fontSize: "10px",
        width: "20px",
    },
    date: {
        fontSize: "10px",
        color: "red",
        width: "55px",
    },
    clientName: {
        fontSize: "10px",
        width: "170px",
    },
    comment: {
        display: "flex",
        fontSize: "10px",
        width: "250px",
        color: "red"
    },
    mb: {
        marginBottom: "10px",
    },
    title: {
        fontSize: "16px",
        paddingBottom: "20px",
    },
    row: {
        display: "flex",
        flexDirection: "row",
    },
    orderlist: {
        marginTop: "-1px",
        display: "flex",
        flexDirection: "row",
        gap: "5px",
        border: "1px solid darkgray",
        marginLeft: "10px",
        padding: "1px",
    },
    qty: {
        fontSize: "12px",
        width: "35px",
        textAlign: "right",
        paddingBottom: "2px",
    },
    unit: {
        fontSize: "11px",
        paddingLeft: "10px",
        width: "70px",
        paddingBottom: "1px",
    },
    name: {
        fontSize: "12px",
        width: "auto",
        paddingBottom: "2px",
    },
});

export default PrintOystersMeal;
