"use client";

import Appshell from "@/components/appshell";
import { Skeleton } from "@/components/ui/skeleton";
import { Page, Text, View, Document, PDFViewer, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";
import React from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Pagee({ params }: { params: { slug: string } }) {
    const [isClient, setIsClient] = React.useState(false);
    const [order, setOrder]: any = React.useState();
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    console.log(order);

    const { data } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/orders/findOne?id=${params.slug}`, fetcher);

    React.useEffect(() => {
        data && setOrder(data);
        if (data && data?.totalMayo) {
            var totalMayo = data.totalMayo;

            const w: any = [800, 550, 300, 100];
            var res: any = {};
            for (const [index, value] of w.entries()) {
                var temp = Math.floor(totalMayo / value);
                totalMayo = totalMayo % value;
                res[index] = temp;
                if (totalMayo > 0) {
                    res[3] += 1;
                }
            }
            setPots(res);
        }
    }, [data]);

    const [pots, setPots]: any = React.useState(0);

    const deliveryDate = JSON.stringify(moment(order?.delivery_date).format("DD-MM-YYYY"));

    const PDF = () => {
        if (data) {
            return (
                <Document>
                    <Page style={styles.page}>
                        <View>
                            <Text>Bon de commande - La Marée Barlin</Text>
                            <Text>&nbsp;</Text>
                            <Text style={styles.textSmall}>
                                Numéro de commande : {order?.num} | Date de livraison : {deliveryDate.slice(1, -1)} |
                                Vendeur : {order?.seller}
                            </Text>
                            <Text>&nbsp;</Text>
                            <Text style={styles.textSmall}>
                                {order?.clientName ? `Client : ${order?.clientName}` : ``}
                            </Text>
                            <Text style={styles.textSmall}>
                                Adresse :{" "}
                                {order?.clientInfo?.postal_address ? `${order?.clientInfo.postal_address}, ` : ``}
                                {order?.clientInfo?.city} {order?.clientInfo?.postal_code}
                            </Text>
                            <Text style={styles.textSmall}>
                                {order?.clientInfo?.email_address ? `Email : ${order?.clientInfo.email_address}` : ``}
                            </Text>
                            <Text style={styles.textSmall}>
                                {order?.clientInfo?.phone_port
                                    ? `Téléphone Portable : ${order?.clientInfo.phone_port}`
                                    : ``}
                            </Text>
                            <Text style={styles.textSmall}>
                                {order?.clientInfo?.phone_fixe
                                    ? `Téléphone Fixe : ${order?.clientInfo.phone_fixe}`
                                    : ``}
                            </Text>
                            <Text>&nbsp;</Text>
                            {/* <Text style={styles.textSmall}>
              Date de commande : {orderDate.slice(1, -1)}
            </Text> */}
                            <Text style={styles.consigne}>
                                {order?.consigne === true ? "CONSIGNE OK" : "CONSIGNE A DEMANDER"}
                            </Text>
                            <Text>&nbsp;</Text>
                            <View style={styles.table}>
                                <View style={[styles.row, styles.bold, styles.header]}>
                                    <Text style={styles.row1}>QTÉ</Text>
                                    <Text style={styles.row2}>CODE</Text>
                                    <Text style={styles.row3}>NOM</Text>
                                    <Text style={styles.row4}>TOTAL</Text>
                                    <Text style={styles.row5}>COMMENTAIRE</Text>
                                </View>
                                {order?.meals.map((item: any) => (
                                    <View key={item.id} style={styles.row} wrap={false}>
                                        <Text style={styles.row1}>
                                            <Text style={styles.bold}>{item.qty}</Text>
                                        </Text>
                                        <Text style={styles.row2}>{item.code}</Text>
                                        <Text style={styles.row3}>{item.name}</Text>
                                        <Text style={styles.row4}>
                                            <Text style={styles.bold}>{(item.price * item.qty).toFixed(2)} EUR</Text>
                                        </Text>
                                        <Text style={styles.row5}>{item.comment}</Text>
                                    </View>
                                ))}

                                {order?.specialMeals.map((item: any) => (
                                    <React.Fragment key={item.id}>
                                        {/* <Text style={styles.miniHeadTable}>Plateau spécial</Text> */}
                                        <View style={styles.row} wrap={false}>
                                            <React.Fragment key={item.id}>
                                                <Text style={styles.row1}>
                                                    <Text style={styles.bold}>1</Text>
                                                </Text>
                                                <Text style={styles.row2}>SP</Text>
                                                <Text style={styles.row3} key={item.id}>
                                                    {item.selectedIngredients?.map((item: any, index: any) => (
                                                        <React.Fragment key={item.id}>
                                                            {(index ? ", " : "") + item.qty + "×" + item.name}
                                                        </React.Fragment>
                                                    ))}
                                                </Text>
                                                <Text style={styles.row4}>
                                                    <Text style={styles.bold}>
                                                        {Math.ceil(item?.finalPrice).toFixed(2)} EUR
                                                    </Text>
                                                </Text>
                                                <Text style={styles.row5} key={item.comment}>
                                                    {item.comment}
                                                </Text>
                                            </React.Fragment>
                                        </View>
                                    </React.Fragment>
                                ))}

                                {order?.vrac?.map((item: any) => (
                                    <React.Fragment key={item.id}>
                                        {/* <Text style={styles.miniHeadTable}>Plateau spécial</Text> */}
                                        {/* <Text style={styles.comment}>{item.comment}</Text> */}
                                        <View style={styles.row} wrap={false}>
                                            <React.Fragment key={item.id}>
                                                <Text style={styles.row1}>
                                                    <Text style={styles.bold}>{item.qty}</Text>
                                                </Text>
                                                <Text style={styles.row2}>VRAC</Text>
                                                <Text style={styles.row3} key={item.id}>
                                                    {item.name}
                                                </Text>
                                                <Text style={styles.row4}>
                                                    <Text style={styles.bold}>
                                                        {(item?.price * item?.qty).toFixed(2)} EUR
                                                    </Text>
                                                </Text>
                                                <Text style={styles.row4} key={item.comment}>
                                                    {item.comment}
                                                </Text>
                                            </React.Fragment>
                                        </View>
                                    </React.Fragment>
                                ))}
                            </View>
                            <Text>&nbsp;</Text>
                            <Text style={styles.textBase}>Montant total : {order?.price?.toFixed(2)} EUR</Text>

                            {order?.deposit && (
                                <>
                                    <Text style={styles.textBase}>Acompte : {order?.deposit.toFixed(2)} EUR</Text>
                                    <Text style={styles.textBase}>
                                        Reste à régler : {(order?.price - order?.deposit).toFixed(2)} EUR
                                    </Text>
                                </>
                            )}
                            {order?.accompte && (
                                <>
                                    <Text style={styles.textBase}>Acompte : {order?.accompte.toFixed(2)} EUR</Text>
                                    <Text style={styles.textBase}>
                                        Reste à régler : {(order?.price - order?.accompte).toFixed(2)} EUR
                                    </Text>
                                </>
                            )}
                            <Text>&nbsp;</Text>
                            {pots[0] != undefined && <Text style={styles.textBase}>Mayonnaise:</Text>}
                            {pots[0] != undefined && pots[0] != 0 && (
                                <Text style={styles.textSmall}>{pots[0]} x Très grand 800g</Text>
                            )}
                            {pots[1] != undefined && pots[1] != 0 && (
                                <Text style={styles.textSmall}>{pots[1]} x Grand 550g</Text>
                            )}
                            {pots[2] != undefined && pots[2] != 0 && (
                                <Text style={styles.textSmall}>{pots[2]} x Moyen 300g</Text>
                            )}
                            {pots[3] != undefined && pots[3] != 0 && (
                                <Text style={styles.textSmall}>{pots[3]} x Petit 100g</Text>
                            )}
                            <Text>&nbsp;</Text>
                            <Text style={styles.textBase}>
                                MERCI DE VERIFIER votre commande AVANT de quitter le magasin (NOMBRE DE PLAT, sauce,
                                mayo...)
                            </Text>
                            <Text>&nbsp;</Text>
                            <Text style={styles.textBase}>
                                {order?.consigne === true ? "" : "Chèque de consigne à verser."}
                            </Text>
                        </View>
                    </Page>
                </Document>
            );
        } else return;
    };

    return (
        <Appshell>
            <h1 className="text-3xl font-semibold pb-4">Impression : Bon de commande</h1>
            {isClient && data ? (
                <>
                    <PDFViewer width="100%" height="700px">
                        <PDF />
                    </PDFViewer>
                    {/* <PDFDownloadLink 
          document={PDF2} 
          fileName="resume.pdf"
        > 
          {({ loading }) => (loading ? 'Chargement du document...' : 'Télécharger le bon de commande')}
        </PDFDownloadLink>  */}
                </>
            ) : (
                <Skeleton className="w-full h-[700px]" />
            )}
        </Appshell>
    );
}

const styles = StyleSheet.create({
    page: {
        padding: "20px",
    },
    comment: {
        width: "25%",
        marginLeft: "432px",
        marginTop: "-11px",
        marginBottom: "2px",
        fontSize: "10px",
    },
    consigne: {
        fontSize: "14px",
        marginLeft: "375px",
        marginTop: "-35px",
    },
    textBase: {
        fontSize: "14px",
    },
    textMd: {
        fontSize: "13px",
    },
    textSmall: {
        fontSize: "12px",
    },
    miniHeadTable: {
        marginTop: "5px",
        fontSize: "10px",
    },
    table: {
        width: "100%",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        borderTop: "1px solid #EEE",
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: "10px",
    },
    header: {
        borderTop: "none",
        fontSize: "10px",
    },
    bold: {
        fontWeight: "bold",
        fontSize: "10px",
    },
    row1: {
        width: "10%",
        fontSize: "10px",
    },
    row2: {
        width: "15%",
        fontSize: "10px",
    },
    row3: {
        width: "35%",
        fontSize: "10px",
        paddingRight: "6px",
    },
    row4: {
        width: "15%",
        fontSize: "10px",
    },
    row5: {
        width: "25%",
        fontSize: "10px",
    },
});
