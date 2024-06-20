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

function PrintHotMeal() {
    const { get: getParam } = useSearchParams();
    const target = getParam("target");
    const from: any = getParam("from");
    const to: any = getParam("to");

    function roundFloat(number: number) {
        return typeof number === "number" && number % 1 !== 0 ? parseFloat(number.toFixed(2)) : number;
    }

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
                            Listing vrac par commande du {format(new Date(from), "dd LLL y", { locale: fr })}{" "}
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
                        Listing vrac par commande du {format(new Date(from), "dd LLL y", { locale: fr })}{" "}
                        {to ? "au " + format(new Date(to), "dd LLL y", { locale: fr }) : "à maintenant"}
                    </h1>
                </div>
            </div>
            <PDFViewer width="100%" height="700px">
                <Document
                    title={`Listing vrac par commande du ${format(new Date(from), "dd LLL y", { locale: fr })} ${" "}
                        ${to ? "au " + format(new Date(to), "dd LLL y", { locale: fr }) : "à maintenant"}`}
                >
                    <Page wrap style={styles.page}>
                        <View style={styles.title}>
                            <Text>
                                Listing vrac par commande du {format(new Date(from), "dd LLL y", { locale: fr })}{" "}
                                {to ? "au " + format(new Date(to), "dd LLL y", { locale: fr }) : "à maitenant"}
                            </Text>
                        </View>
                        {data.map((item: any) => (
                            <View wrap={false} key={item.name} style={styles.mb}>
                                <View style={styles.row}>
                                    <Text style={styles.num}>{item.num} </Text>
                                    <Text style={styles.delivery_date}>
                                        {format(new Date(item.delivery_date), "dd LLL yyyy", { locale: fr })}
                                    </Text>
                                    <Text style={styles.clientName}>{item.clientName}</Text>
                                    {item.reste > 0 && <Text style={styles.reste}>{item.reste} €</Text>}
                                </View>
                                <View>
                                    {item.vrac.map((vrac: any) => (
                                        <View key={vrac.name} style={styles.list}>
                                            <Text style={styles.date}>{vrac.qty}</Text>
                                            <Text style={styles.vracName}>{vrac.name} </Text>
                                            <Text style={styles.comment}>{vrac.comment} </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                        <Text
                            style={styles.pagination}
                            render={({ pageNumber, totalPages }) =>
                                `Listing vrac par commande du ${format(new Date(from), "dd LLL y", { locale: fr })} ${
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
    num: {
        fontSize: "13px",
        width: "60px",
        border: "1px solid darkgray",
        paddingTop: "1px",
        paddingLeft: "2px",
        textAlign: "right",
    },
    itemName: {
        fontSize: "13px",
        width: "70px",
        border: "1px solid darkgray",
        paddingTop: "1px",
        paddingLeft: "2px",
        marginLeft: "-1px",
    },
    date: {
        fontSize: "13px",
        width: "40px",
        border: "1px solid darkgray",
        paddingTop: "1px",
        paddingLeft: "2px",
        marginLeft: "-1px",
        textAlign: "center",
    },
    delivery_date: {
        fontSize: "13px",
        width: "80px",
        border: "1px solid darkgray",
        paddingTop: "1px",
        paddingLeft: "2px",
        marginLeft: "-1px",
        color: "red",
        textAlign: "center",
    },
    comment: {
        fontSize: "13px",
        width: "200px",
        border: "1px solid darkgray",
        paddingTop: "1px",
        paddingLeft: "2px",
        marginLeft: "-1px",
        color: "red",
    },
    list: {
        display: "flex",
        flexDirection: "row",
        fontSize: "13px",
        marginBottom: "-1px",
        paddingLeft: "9px",
    },
    clientName: {
        fontSize: "13px",
        width: "219px",
        border: "1px solid darkgray",
        paddingTop: "1px",
        paddingLeft: "2px",
        marginLeft: "-1px",
    },
    vracName: {
        fontSize: "13px",
        width: "300px",
        border: "1px solid darkgray",
        paddingTop: "1px",
        paddingLeft: "2px",
        marginLeft: "-1px",
    },
    vracQty: {
        fontSize: "13px",
        width: "25px",
        border: "1px solid darkgray",
        paddingTop: "1px",
        paddingLeft: "2px",
        marginLeft: "-1px",
        textAlign: "center",
    },
    reste: {
        fontSize: "13px",
        width: "70px",
        border: "1px solid darkgray",
        paddingTop: "1px",
        paddingLeft: "2px",
        marginLeft: "-1px",
        color: "red",
        textAlign: "center",
    },
    vracComment: {
        fontSize: "13px",
        width: "190px",
        border: "1px solid darkgray",
        color: "red",
        paddingTop: "1px",
        paddingLeft: "2px",
        marginLeft: "-1px",
    },
    mb: {
        marginBottom: "15px",
    },
    title: {
        fontSize: "16px",
        paddingBottom: "20px",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        marginBottom: "-1px",
    },
    qty: {
        fontSize: "13px",
        width: "35px",
        textAlign: "right",
        paddingBottom: "2px",
    },
    unit: {
        fontSize: "13px",
        padding: "0px 10px",
        paddingBottom: "1px",
    },
    name: {
        fontSize: "13px",
        width: "auto",
        paddingBottom: "2px",
    },
});

export default PrintHotMeal;
