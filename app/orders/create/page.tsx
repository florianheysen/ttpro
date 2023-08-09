"use client";

import * as React from "react";
import { Toaster, toast } from "sonner";
import { setLocal } from "@/lib/utils";
import Appshell from "@/components/appshell";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import ClientSelector from "@/components/clientSelector";
import { SellerSelectorPopup } from "@/components/sellerSelectorPopup";
import NewClientPopup from "@/components/newClientPopup";

import OrderMealsSelector from "@/components/orderMealsSelector";
import OrderVracSelector from "@/components/orderVracSelector";

import { Cross2Icon } from "@radix-ui/react-icons";

export default function CreateOrder() {
    const [accompte, setAccompte] = React.useState<number>(0);
    const [order, setOrder] = React.useState<any>({
        seller: null,
        client: null,
        meals: [],
        consigne: false,
        accompte,
    });

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(amount);
    };

    const handleChange = (field: string, newValue: unknown) => {
        setOrder((prevState: any) => ({
            ...prevState,
            [field]: newValue,
        }));
    };

    const handleConsigne = () => {
        handleChange("consigne", !order.consigne);
    };

    const handleAccompte = (amount: number) => {
        setAccompte(amount);
    };

    const handleQty = ({ code, qty }: { code: string; qty: number }) => {
        const nouveauMeals = order.meals.map((meal: any) => {
            if (meal.code === code) {
                return {
                    ...meal,
                    qty,
                };
            }
            return meal;
        });
        handleChange("meals", nouveauMeals);
    };

    const handleComment = ({ code, comment }: { code: string; comment: string }) => {
        const nouveauMeals = order.meals.map((meal: any) => {
            if (meal.code === code) {
                return {
                    ...meal,
                    comment,
                };
            }
            return meal;
        });
        handleChange("meals", nouveauMeals);
    };

    const deleteSelectedMeal = (meal: any) => {
        if (order.meals.length == 1) {
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
    };

    React.useEffect(() => {
        setLocal("order", JSON.stringify(order));
    }, [order]);

    const finalMealsPrice: number = order.meals.reduce(
        (total: number, obj: { price: number; qty: number }) => obj.price * obj.qty + total,
        0
    );

    const handleSubmit = () => {
        console.log(order);
    };

    return (
        <Appshell>
            <div className="flex align-middle justify-between">
                <h1 className="text-3xl font-semibold">Nouvelle commande</h1>
                <div className="flex gap-3 mb-4">
                    <SellerSelectorPopup order={order} handleChange={handleChange} />
                    <Button
                        className={order.consigne ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                        onClick={handleConsigne}
                    >
                        Consigne
                    </Button>
                    <Button onClick={handleSubmit}>Créer la commande</Button>
                </div>
            </div>
            <div className="flex flex-col gap-1 text-sm font-semibold py-4">
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
                    <section className="flex gap-4">
                        <div>
                            <p className="mb-1">Montant total</p>
                            <Input className="pointer-events-none w-36" value={formatPrice(finalMealsPrice)} />
                        </div>

                        <div>
                            <p className="mb-1">Accompte</p>
                            <div className="relative group">
                                <Input
                                    className="w-36 peer"
                                    type="number"
                                    min="0"
                                    max={finalMealsPrice}
                                    onChange={(e) => handleAccompte(parseInt(e.target.value))}
                                    value={accompte}
                                />
                                <Badge
                                    onClick={() => setAccompte(finalMealsPrice)}
                                    className="group-hover:visible invisible absolute bottom-[7px] right-8 rounded cursor-pointer"
                                    variant="secondary"
                                >
                                    max
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <p className="mb-1">Reste à régler</p>
                            <Input
                                className="pointer-events-none w-36"
                                value={formatPrice(finalMealsPrice - accompte)}
                            />
                        </div>
                    </section>
                </div>

                <div className="flex mt-8 gap-4">
                    <OrderMealsSelector order={order} handleChange={handleChange} />
                    <OrderVracSelector order={order} handleChange={handleChange} />
                    <Button variant="outline">Créer un plateau spécial</Button>
                </div>

                <span className="mb-1 mt-8">Résumé de la commande</span>
                <section className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Code</TableHead>
                                <TableHead className="w-[100px]">Nom</TableHead>
                                <TableHead className="w-[70px]">Prix/Unité</TableHead>
                                <TableHead className="w-[70px]">Qté</TableHead>
                                <TableHead className="w-[200px]">Commentaire</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order?.meals?.map((meal: any) => (
                                <TableRow key={meal.mealId}>
                                    <TableCell className="font-bold w-[80px]">{meal.code}</TableCell>
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
                                                    code: meal.code,
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
                                                    code: meal.code,
                                                    comment: e.target.value,
                                                })
                                            }
                                            defaultValue={meal.comment}
                                        />
                                    </TableCell>
                                    <TableCell className="flex gap-2">
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
                        </TableBody>
                        {(order.meals?.length === 0 || order.meals === undefined) && (
                            <TableCaption className="mb-4">Aucun plat selectionné</TableCaption>
                        )}
                    </Table>
                </section>
            </div>
            <Toaster richColors closeButton />
        </Appshell>
    );
}
