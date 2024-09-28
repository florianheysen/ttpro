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
import { EditClientPopup } from "@/components/editClientPopup";

import { OrderMealsSelector } from "@/components/orderMealsSelector";
import { OrderVracSelector } from "@/components/orderVracSelector";
import { NewSpPopup } from "@/components/newSpPopup";
import { EditSpPopup } from "@/components/editSpPopup";

import { OrderDatePicker } from "@/components/orderDatePicker";

import { Cross2Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/loadingScreen";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function Page({ params }: { params: { id: string } }) {
    const { data, isValidating } = useSWR(
        `${process.env.NEXT_PUBLIC_URL}/api/estimates/findOne?id=${params.id}`,
        fetcher
    );
    const [accompte, setAccompte] = React.useState<any>(0);
    const [client, setClient] = React.useState<boolean>(false);
    const [estimate, setEstimate] = React.useState<any>({
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
            setEstimate({ ...data });
            setAccompte(data.accompte);
        }
    }, [data, client]);

    React.useEffect(() => {
        setClient(true);
    }, []);

    React.useEffect(() => {
        setLocal("estimate", JSON.stringify(estimate));
    }, [estimate]);

    if (!data) return <LoadingScreen />;

    const handleChange = (field: string, newValue: unknown) => {
        setEstimate((prevState: any) => ({
            ...prevState,
            [field]: newValue,
        }));
    };

    const handleQty = ({ item, qty }: { item: any; qty: number }) => {
        if (item.code === "VRAC") {
            const nouveauMeals = estimate.vrac.map((meal: any) => {
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
            const nouveauMeals = estimate.specialMeals.map((meal: any) => {
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
            const nouveauMeals = estimate.meals.map((meal: any) => {
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
            const nouveauMeals = estimate.vrac.map((meal: any) => {
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
            const nouveauMeals = estimate.specialMeals.map((meal: any) => {
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
            const nouveauMeals = estimate.meals.map((meal: any) => {
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
                if (estimate.specialMeals.length === 1) {
                    setEstimate((prevState: any) => ({
                        ...prevState,
                        specialMeals: [],
                    }));
                } else {
                    setEstimate((prevState: any) => ({
                        ...prevState,
                        specialMeals: estimate.specialMeals.filter((obj: any) => obj.id !== meal.id),
                    }));
                }

                toast(
                    <p className="flex gap-1 align-middle justify-center font-medium">
                        Plat <b className="font-bold">SP</b> retiré du devis.
                    </p>
                );
                break;

            case "VRAC":
                if (estimate.vrac.length === 1) {
                    setEstimate((prevState: any) => ({
                        ...prevState,
                        vrac: [],
                    }));
                } else {
                    setEstimate((prevState: any) => ({
                        ...prevState,
                        vrac: estimate.vrac.filter((obj: any) => obj._id !== meal._id),
                    }));
                }

                toast(
                    <p className="flex gap-1 align-middle justify-center font-medium">
                        Ingrédient <b className="font-bold">VRAC</b> retiré du devis.
                    </p>
                );
                break;

            default:
                if (estimate.meals.length === 1) {
                    setEstimate((prevState: any) => ({
                        ...prevState,
                        meals: [],
                    }));
                } else {
                    setEstimate((prevState: any) => ({
                        ...prevState,
                        meals: estimate.meals.filter((obj: any) => obj.mealId !== meal.mealId),
                    }));
                }

                toast(
                    <p className="flex gap-1 align-middle justify-center font-medium">
                        Plat <b className="font-bold">{meal.code}</b> retiré du devis.
                    </p>
                );
                break;
        }
    };

    console.log(estimate);

    const handleSubmit = async () => {
        if (orderValidation(estimate) === true) {
            const finalEstimate = {
                ...estimate,
                _id: data._id,
                price: totalPrice,
                accompte: parseFloat(accompte) != 0 ? parseFloat(accompte) : 0,
                totalMayo: calculerTotalMayonnaise(estimate),
                clientName: estimate.client.name.toUpperCase(),
                clientId: { $oid: estimate.client._id },
                clientInfo: {
                    phone_port: estimate.client.phone_port,
                    phone_fixe: estimate.client.phone_fix,
                    city: estimate.client.city,
                    postal_code: estimate.client.postal_code,
                    postal_address: estimate.client.postal_address,
                    email_address: estimate.email_address,
                },
            };
            delete finalEstimate.client;

            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/estimates/updateOne`, {
                method: "POST",
                headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ estimate: finalEstimate }),
            });

            const result = await res.json();

            if (result?.acknowledged === true) {
                router.push(`/estimates/print/${params.id}`);
            } else {
                toast.error("Une erreur est survenue");
            }
        }
    };

    const mealPrice: number = estimate.meals?.reduce(
        (total: number, obj: { price: number; qty: number }) => obj.price * obj.qty + total,
        0
    );

    const spPrice: number = estimate.specialMeals?.reduce(
        (total: number, obj: { finalPrice: number; qty: number }) => obj.finalPrice * obj.qty + total,
        0
    );

    const vracPrice: number = estimate.vrac?.reduce(
        (total: number, obj: { price: number; qty: number }) => obj.price * obj.qty + total,
        0
    );

    const totalPrice = (mealPrice || 0) + (spPrice || 0) + (vracPrice || 0);

    return (
        <Appshell>
            <div className="flex align-middle justify-between">
                <h1 className="text-3xl font-semibold">Devis {estimate.num}</h1>
                <div className="flex gap-3 mb-4">
                    <SellerSelectorPopup isDefaultOpen={false} order={estimate} handleChange={handleChange} />
                    {/*  <Button
                        className={
                            estimate.consigne ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                        }
                        onClick={() => handleChange("consigne", !estimate.consigne)}
                    >
                        Consigne
                    </Button> */}
                    <Button onClick={handleSubmit}>Mettre à jour</Button>
                </div>
            </div>
            <div className="flex flex-col gap-1 text-sm font-semibold py-4">
                <div className="flex gap-8">
                    <div className="flex flex-row align-middle justify-between">
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex flex-row items-end gap-2">
                                <ClientSelector order={estimate} handleChange={handleChange} />
                                {estimate.client && <EditClientPopup order={estimate} handleChange={handleChange} />}
                                <NewClientPopup handleChange={handleChange} />
                            </div>

                            {estimate.client && (
                                <div className="flex gap-1">
                                    {estimate.client.city && (
                                        <Badge className="rounded" variant="secondary">
                                            {estimate.client.city}
                                        </Badge>
                                    )}
                                    {estimate.client.phone_fixe && (
                                        <Badge className="rounded" variant="secondary">
                                            {estimate.client.phone_fixe}
                                        </Badge>
                                    )}
                                    {estimate.client.phone_port && (
                                        <Badge className="rounded" variant="secondary">
                                            {estimate.client.phone_port}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* <div className="flex flex-col">
                        <span className="mb-1 ">Date de livraison</span>
                        <OrderDatePicker data={data} order={estimate} handleChange={handleChange} />
                    </div> */}
                </div>
                <span className="mb-1 mt-8">Ajouter au devis</span>
                <div className="flex gap-4">
                    {/* <OrderMealsSelector order={estimate} handleChange={handleChange} /> */}
                    {/* <OrderVracSelector order={estimate} handleChange={handleChange} /> */}
                    <NewSpPopup order={estimate} handleChange={handleChange} />
                </div>
                <div className="flex gap-4 mt-8">
                    {/*  <span className="mb-1 mt-8">Résumé de la commande</span> */}
                    <section className="flex gap-4 mb-2">
                        <div>
                            <p className="mb-1">Montant total</p>
                            <Input className="pointer-events-none w-36" value={formatPrice(totalPrice)} />
                        </div>

                        {/* <div>
                            <p className="mb-1">Accompte</p>
                            <div className="relative group">
                                <Input
                                    className="w-36 peer"
                                    type="number"
                                    min="0"
                                    max={totalPrice}
                                    onChange={(e) => setAccompte(e.target.value)}
                                    value={accompte}
                                />
                            </div>
                        </div>

                        <div>
                            <p className="mb-1">Reste à régler</p>
                            <Input className="pointer-events-none w-36" value={formatPrice(totalPrice - accompte)} />
                        </div> */}
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
                            {estimate?.meals?.map((meal: any) => (
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
                                                    qty: parseFloat(e.target.value),
                                                })
                                            }
                                            defaultValue={meal.qty}
                                        />
                                    </TableCell>
                                    <TableCell className="w-[100px]">
                                        <Input
                                            className="w-48"
                                            type="text"
                                            maxLength={90}
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
                            {estimate?.specialMeals?.map((meal: any) => (
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
                                                    <Dialog>
                                                        <DialogTrigger>
                                                            <p className="w-[200px] text-left whitespace-nowrap truncate cursor-help">
                                                                Plateau spécial
                                                            </p>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Plateau spécial</DialogTitle>
                                                                <p>
                                                                    <br />
                                                                    <ul>
                                                                        {meal.selectedIngredients.map(
                                                                            (ingredient: any) => (
                                                                                <li
                                                                                    className="text-black"
                                                                                    key={ingredient.id}
                                                                                >
                                                                                    - {ingredient.qty} ×{" "}
                                                                                    {ingredient.name}
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                </p>
                                                            </DialogHeader>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Voir les ingrédients</p>
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
                                                    qty: parseFloat(e.target.value),
                                                })
                                            }
                                            defaultValue={meal.qty}
                                        />
                                    </TableCell>
                                    <TableCell className="w-[100px]">
                                        <Input
                                            className="w-48"
                                            type="text"
                                            maxLength={90}
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
                                        <EditSpPopup order={estimate} handleChange={handleChange} initialData={meal} />
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
                            {estimate?.vrac?.map((vrac: any) => (
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
                                                    qty: parseFloat(e.target.value),
                                                })
                                            }
                                            defaultValue={vrac.qty}
                                        />
                                    </TableCell>
                                    <TableCell className="w-[100px]">
                                        <Input
                                            className="w-48"
                                            type="text"
                                            maxLength={90}
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
                        {estimate.meals?.length === 0 &&
                            estimate.specialMeals?.length === 0 &&
                            estimate.vrac?.length === 0 && (
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
        toast.error("Veuillez ajouter un plat");
    }
    /* if (order.delivery_date === null) {
        toast.error("Veuillez choisir une date de livraison");
    } */
    if (
        order.seller === null ||
        order.client === null ||
        (order.meals.length <= 0 && order.specialMeals.length <= 0 && order.vrac.length <= 0) /*  ||
        order.delivery_date === null */
    ) {
        return false;
    } else {
        return true;
    }
};
