"use client";

import * as React from "react";
import { Toaster, toast } from "sonner";
import moment from "moment";
import { setLocal, stringIngredients, formatPrice, fetcher, calculerTotalMayonnaise } from "@/lib/utils";
import Appshell from "@/components/appshell";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ClientSelector } from "@/components/clientSelector";
import { SellerSelectorPopup } from "@/components/sellerSelectorPopup";
import { NewClientPopup } from "@/components/newClientPopup";

import { OrderMealsSelector } from "@/components/orderMealsSelector";
import { OrderVracSelector } from "@/components/orderVracSelector";
import { NewSpPopup } from "@/components/newSpPopup";
import { EditSpPopup } from "@/components/editSpPopup";

import { OrderDatePicker } from "@/components/orderDatePicker";

import { Cross2Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/loadingScreen";

export default function Page({ params }: { params: { id: string } }) {
    const { data, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/orders/findOne?id=${params.id}`, fetcher);
    const [accompte, setAccompte] = React.useState<any>(0);
    const [client, setClient] = React.useState<boolean>(false);
    const [order, setOrder] = React.useState<any>({
        num: null,
        seller: null,
        client: null,
        meals: [],
        specialMeals: [],
        vrac: [],
        consigne: false,
        accompte,
        delivery_date: null,
        created_at: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSSSS"),
    });

    const router = useRouter();

    React.useEffect(() => {
        if (data && !isValidating) {
            setOrder({ ...data });
        }
    }, [data, client]);

    React.useEffect(() => {
        setClient(true);
    }, []);

    React.useEffect(() => {
        setLocal("order", JSON.stringify(order));
    }, [order]);

    if (!data) return <LoadingScreen />;

    const handleChange = (field: string, newValue: unknown) => {
        setOrder((prevState: any) => ({
            ...prevState,
            [field]: newValue,
        }));
    };

    const handleQty = ({ item, qty }: { item: any; qty: number }) => {
        if (item.code === "VRAC") {
            const nouveauMeals = order.vrac.map((meal: any) => {
                if (meal._id === item._id) {
                    return {
                        ...meal,
                        qty,
                    };
                }
                return meal;
            });
            handleChange("vrac", nouveauMeals);
        } else if (item.code === "SP") {
            const nouveauMeals = order.specialMeals.map((meal: any) => {
                if (meal.id === item.id) {
                    return {
                        ...meal,
                        qty,
                    };
                }
                return meal;
            });
            handleChange("specialMeals", nouveauMeals);
        } else {
            const nouveauMeals = order.meals.map((meal: any) => {
                if (meal.code === item.code) {
                    return {
                        ...meal,
                        qty,
                    };
                }
                return meal;
            });
            handleChange("meals", nouveauMeals);
        }
    };

    const handleComment = ({ item, comment }: { item: any; comment: string }) => {
        if (item.code === "VRAC") {
            const nouveauMeals = order.vrac.map((meal: any) => {
                if (meal._id === item._id) {
                    return {
                        ...meal,
                        comment,
                    };
                }
                return meal;
            });
            handleChange("vrac", nouveauMeals);
        } else if (item.code === "SP") {
            const nouveauMeals = order.specialMeals.map((meal: any) => {
                if (meal.id === item.id) {
                    return {
                        ...meal,
                        comment,
                    };
                }
                return meal;
            });
            handleChange("specialMeals", nouveauMeals);
        } else {
            const nouveauMeals = order.meals.map((meal: any) => {
                if (meal.code === item.code) {
                    return {
                        ...meal,
                        comment,
                    };
                }
                return meal;
            });
            handleChange("meals", nouveauMeals);
        }
    };

    const deleteSelectedMeal = (meal: any) => {
        switch (meal.code) {
            case "SP":
                if (order.specialMeals.length === 1) {
                    setOrder((prevState: any) => ({
                        ...prevState,
                        specialMeals: [],
                    }));
                } else {
                    setOrder((prevState: any) => ({
                        ...prevState,
                        specialMeals: order.specialMeals.filter((obj: any) => obj.id !== meal.id),
                    }));
                }

                toast(
                    <p className="flex gap-1 align-middle justify-center font-medium">
                        Plat <b className="font-bold">SP</b> retiré de la commande.
                    </p>
                );
                break;

            case "VRAC":
                if (order.vrac.length === 1) {
                    setOrder((prevState: any) => ({
                        ...prevState,
                        vrac: [],
                    }));
                } else {
                    setOrder((prevState: any) => ({
                        ...prevState,
                        vrac: order.vrac.filter((obj: any) => obj._id !== meal._id),
                    }));
                }

                toast(
                    <p className="flex gap-1 align-middle justify-center font-medium">
                        Ingrédient <b className="font-bold">VRAC</b> retiré de la commande.
                    </p>
                );
                break;

            default:
                if (order.meals.length === 1) {
                    setOrder((prevState: any) => ({
                        ...prevState,
                        meals: [],
                    }));
                } else {
                    setOrder((prevState: any) => ({
                        ...prevState,
                        meals: order.meals.filter((obj: any) => obj.mealId !== meal.mealId),
                    }));
                }

                toast(
                    <p className="flex gap-1 align-middle justify-center font-medium">
                        Plat <b className="font-bold">{meal.code}</b> retiré de la commande.
                    </p>
                );
                break;
        }
    };

    const handleSubmit = async () => {
        if (orderValidation(order) === true) {
            const finalOrder = {
                ...order,
                _id: data._id,
                price: totalPrice,
                totalMayo: calculerTotalMayonnaise(order),
                clientName: order.client.name.toUpperCase(),
                clientId: { $oid: order.client._id },
                clientInfo: {
                    phone_port: order.client.phone_port,
                    phone_fixe: order.client.phone_fix,
                    city: order.client.city,
                    postal_code: order.client.postal_code,
                    postal_address: order.client.postal_address,
                    email_address: order.email_address,
                },
            };
            delete finalOrder.client;

            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders/updateOne`, {
                method: "POST",
                headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ order: finalOrder }),
            });

            const result = await res.json();

            if (result.acknowledged === true) {
                router.push(`/orders/print/${params.id}`);
            } else {
                toast.error("Une erreur est survenue");
            }
        }
    };

    const mealPrice: number = order.meals?.reduce(
        (total: number, obj: { price: number; qty: number }) => obj.price * obj.qty + total,
        0
    );

    const spPrice: number = order.specialMeals?.reduce(
        (total: number, obj: { finalPrice: number; qty: number }) => obj.finalPrice * obj.qty + total,
        0
    );

    const vracPrice: number = order.vrac?.reduce(
        (total: number, obj: { price: number; qty: number }) => obj.price * obj.qty + total,
        0
    );

    const totalPrice = (mealPrice || 0) + (spPrice || 0) + (vracPrice || 0);

    return (
        <Appshell>
            <div className="flex align-middle justify-between">
                <h1 className="text-3xl font-semibold">Commande {order.num}</h1>
                <div className="flex gap-3 mb-4">
                    <SellerSelectorPopup isDefaultOpen={false} order={order} handleChange={handleChange} />
                    <Button
                        className={order.consigne ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                        onClick={() => handleChange("consigne", !order.consigne)}
                    >
                        Consigne
                    </Button>
                    <Button onClick={handleSubmit}>Mettre à jour</Button>
                </div>
            </div>
            <div className="flex flex-col gap-1 text-sm font-semibold py-4">
                <div className="flex gap-8">
                    <div className="flex flex-row align-middle justify-between">
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex flex-row items-end gap-2">
                                <ClientSelector order={order} handleChange={handleChange} />
                                <NewClientPopup handleChange={handleChange} />
                            </div>

                            {order.client && (
                                <div className="flex gap-1">
                                    {order.client.city && (
                                        <Badge className="rounded" variant="secondary">
                                            {order.client.city}
                                        </Badge>
                                    )}
                                    {order.client.phone_fixe && (
                                        <Badge className="rounded" variant="secondary">
                                            {order.client.phone_fixe}
                                        </Badge>
                                    )}
                                    {order.client.phone_port && (
                                        <Badge className="rounded" variant="secondary">
                                            {order.client.phone_port}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="mb-1 ">Date de livraison</span>
                        <OrderDatePicker data={data} order={order} handleChange={handleChange} />
                    </div>
                </div>
                <span className="mb-1 mt-8">Ajouter à la commande</span>
                <div className="flex gap-4">
                    <OrderMealsSelector order={order} handleChange={handleChange} />
                    <OrderVracSelector order={order} handleChange={handleChange} />
                    <NewSpPopup order={order} handleChange={handleChange} />
                </div>
                <div className="flex gap-4 mt-8">
                    {/*  <span className="mb-1 mt-8">Résumé de la commande</span> */}
                    <section className="flex gap-4 mb-2">
                        <div>
                            <p className="mb-1">Montant total</p>
                            <Input className="pointer-events-none w-36" value={formatPrice(totalPrice)} />
                        </div>

                        <div>
                            <p className="mb-1">Accompte</p>
                            <div className="relative group">
                                <Input
                                    className="w-36 peer"
                                    type="number"
                                    min="0"
                                    max={totalPrice}
                                    onChange={(e) => setAccompte(parseInt(e.target.value))}
                                    value={accompte}
                                />
                                <Badge
                                    onClick={() => setAccompte(totalPrice.toFixed(2))}
                                    className="group-hover:visible invisible absolute bottom-[7px] right-8 rounded cursor-pointer"
                                    variant="secondary"
                                >
                                    max
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <p className="mb-1">Reste à régler</p>
                            <Input className="pointer-events-none w-36" value={formatPrice(totalPrice - accompte)} />
                        </div>
                    </section>
                </div>
                <section className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Code</TableHead>
                                <TableHead className="w-[100px]">Nom</TableHead>
                                <TableHead className="w-[70px]">Prix/Unité</TableHead>
                                <TableHead className="w-[70px]">Qté</TableHead>
                                <TableHead className="w-[200px]">Commentaire</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order?.meals?.map((meal: any) => (
                                <TableRow key={meal.mealId}>
                                    <TableCell className="font-bold w-[80px]">
                                        <Badge className="rounded" variant="outline">
                                            {meal.code}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="w-[100px]">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <p className="w-[200px] text-left whitespace-nowrap truncate cursor-help">
                                                        {meal.name}
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{meal.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell className="w-[70px]">{formatPrice(meal.price)}</TableCell>
                                    <TableCell className="w-[70px]">
                                        <Input
                                            className="w-24"
                                            type="number"
                                            min="1"
                                            max="9999"
                                            onChange={(e) =>
                                                handleQty({
                                                    item: meal,
                                                    qty: parseInt(e.target.value),
                                                })
                                            }
                                            defaultValue={meal.qty}
                                        />
                                    </TableCell>
                                    <TableCell className="w-[100px]">
                                        <Input
                                            className="w-48"
                                            type="text"
                                            maxLength={30}
                                            onChange={(e) =>
                                                +handleComment({
                                                    item: meal,
                                                    comment: e.target.value,
                                                })
                                            }
                                            defaultValue={meal.comment}
                                        />
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <span className="h-8 w-8" />
                                        <Button
                                            onClick={() => deleteSelectedMeal(meal)}
                                            variant="destructive"
                                            className="h-8 w-8 p-0"
                                        >
                                            <span className="sr-only">Supprimer</span>
                                            <Cross2Icon className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {order?.specialMeals?.map((meal: any) => (
                                <TableRow key={meal.mealId}>
                                    <TableCell className="font-bold w-[80px]">
                                        <Badge className="rounded" variant="outline">
                                            SP
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="w-[100px]">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <p className="w-[200px] text-left whitespace-nowrap truncate cursor-help">
                                                        {stringIngredients(meal.selectedIngredients)}
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{stringIngredients(meal.selectedIngredients)}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell className="w-[70px]">{formatPrice(meal.finalPrice)}</TableCell>
                                    <TableCell className="w-[70px]">
                                        <Input
                                            className="w-24"
                                            type="number"
                                            min="1"
                                            max="9999"
                                            onChange={(e) =>
                                                handleQty({
                                                    item: meal,
                                                    qty: parseInt(e.target.value),
                                                })
                                            }
                                            defaultValue={meal.qty}
                                        />
                                    </TableCell>
                                    <TableCell className="w-[100px]">
                                        <Input
                                            className="w-48"
                                            type="text"
                                            maxLength={30}
                                            onChange={(e) =>
                                                +handleComment({
                                                    item: meal,
                                                    comment: e.target.value,
                                                })
                                            }
                                            defaultValue={meal.comment}
                                        />
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <EditSpPopup order={order} handleChange={handleChange} initialData={meal} />
                                        <Button
                                            onClick={() => deleteSelectedMeal(meal)}
                                            variant="destructive"
                                            className="h-8 w-8 p-0"
                                        >
                                            <span className="sr-only">Supprimer</span>
                                            <Cross2Icon className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {order?.vrac?.map((vrac: any) => (
                                <TableRow key={vrac._id}>
                                    <TableCell className="font-bold w-[80px]">
                                        <Badge className="rounded" variant="outline">
                                            VRAC
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="w-[100px]">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <p className="w-[200px] text-left whitespace-nowrap truncate cursor-help">
                                                        {vrac.name}
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{vrac.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell className="w-[70px]">{formatPrice(vrac.price)}</TableCell>
                                    <TableCell className="w-[70px]">
                                        <Input
                                            className="w-24"
                                            type="number"
                                            min="1"
                                            max="9999"
                                            onChange={(e) =>
                                                handleQty({
                                                    item: vrac,
                                                    qty: parseInt(e.target.value),
                                                })
                                            }
                                            defaultValue={vrac.qty}
                                        />
                                    </TableCell>
                                    <TableCell className="w-[100px]">
                                        <Input
                                            className="w-48"
                                            type="text"
                                            maxLength={30}
                                            onChange={(e) =>
                                                +handleComment({
                                                    item: vrac,
                                                    comment: e.target.value,
                                                })
                                            }
                                            defaultValue={vrac.comment}
                                        />
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <span className="h-8 w-8" />
                                        <Button
                                            onClick={() => deleteSelectedMeal(vrac)}
                                            variant="destructive"
                                            className="h-8 w-8 p-0"
                                        >
                                            <span className="sr-only">Supprimer</span>
                                            <Cross2Icon className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        {order.meals?.length === 0 && order.specialMeals?.length === 0 && order.vrac?.length === 0 && (
                            <TableCaption className="mb-4">Aucun élément selectionné</TableCaption>
                        )}
                    </Table>
                </section>
            </div>
            <Toaster richColors closeButton />
        </Appshell>
    );
}

const orderValidation = (order: any) => {
    if (order.seller === null) {
        toast.error("Veuillez sélectionner un vendeur");
    }
    if (order.client === null) {
        toast.error("Veuillez sélectionner un client");
    }
    if (order.meals.length <= 0 && order.specialMeals.length <= 0 && order.vrac.length <= 0) {
        toast.error("Veuillez sélectionner au moins un plat/vrac");
    }
    if (order.delivery_date === null) {
        toast.error("Veuillez choisir une date de livraison");
    }
    if (order.delivery_date === moment(new Date()).format("YYYY-MM-DD")) {
        toast.error("La livraison ne peux pas être le jour actuel");
    }
    if (
        order.seller === null ||
        order.client === null ||
        (order.meals.length <= 0 && order.specialMeals.length <= 0 && order.vrac.length <= 0) ||
        order.delivery_date === null ||
        order.delivery_date === moment(new Date()).format("YYYY-MM-DD")
    ) {
        return false;
    } else {
        return true;
    }
};
