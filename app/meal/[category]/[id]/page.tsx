"use client";

import React from "react";
import Appshell from "@/components/appshell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MealIngredientSelector } from "@/components/mealIngredientSelector";
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Cross2Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import LoadingScreen from "@/components/loadingScreen";
import { useRouter } from "next/navigation";

const categoryTitles: Record<string, string> = {
    hot: "chaud",
    cold: "froid",
    oysters: "d'huître ouvertes",
    special: "PL",
};

function EditMealPage({ params: { id, category } }: { params: { id: string; category: string } }) {
    const router = useRouter();
    const title = categoryTitles[category as string] || "";
    const { data, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/meals/findOne?id=${id}`, fetcher);

    const [meal, setMeal] = React.useState({
        mealId: crypto.randomUUID(),
        mealName: "",
        mealCode: "",
        mealPrice: 0,
        mealCategory: "",
        indisponible: false,
        ingredients: [],
    });

    React.useEffect(() => {
        if (data && !isValidating) {
            setMeal({ ...data, indisponible: data.indisponible ?? false });
        }
    }, [data, isValidating]);

    const handleChange = (field: string, newValue: unknown) => {
        setMeal((prevState: any) => ({
            ...prevState,
            [field]: newValue,
        }));
    };

    const handleQty = ({ item, qty }: { item: any; qty: number }) => {
        const n = meal.ingredients.map((meal: any) => {
            if (meal.id === item.id) {
                return {
                    ...meal,
                    qty,
                };
            }
            return meal;
        });
        handleChange("ingredients", n);
    };

    const handleDelete = (ingredient: any) => {
        if (meal.ingredients.length === 1) {
            setMeal((prevState: any) => ({
                ...prevState,
                ingredients: [],
            }));
        } else {
            setMeal((prevState: any) => ({
                ...prevState,
                ingredients: meal.ingredients.filter((obj: any) => obj.id !== ingredient.id),
            }));
        }

        toast(<p className="flex gap-1 align-middle justify-center font-medium">Ingrédient retiré de la commande.</p>);
    };

    const handleSubmit = async () => {
        const formatMeal = {
            ...meal,
            mealPrice: +meal.mealPrice,
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/meals/updateOne`, {
            method: "POST",
            headers: {
                Accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ meal: formatMeal }),
        });

        const result = await res.json();

        console.log(result);

        router.push(`/meal/${category}/`);
    };

    if (!data || isValidating) return <LoadingScreen />;

    return (
        <Appshell>
            <div className="flex justify-between pb-8">
                <h1 className="text-3xl font-semibold h">Modifier un plat {title}</h1>
            </div>
            <section className="flex flex-col gap-6">
                <div className="flex flex-row w-full gap-6 flex-wrap">
                    <div>
                        <p className="mb-1">Nom du plat</p>
                        <Input
                            className="w-80"
                            onChange={(e) => handleChange("mealName", e.target.value)}
                            value={meal.mealName}
                        />
                    </div>
                    <div>
                        <p className="mb-1">Code</p>
                        <Input
                            className="w-32"
                            onChange={(e) => handleChange("mealCode", e.target.value)}
                            value={meal.mealCode}
                        />
                    </div>
                    <div>
                        <p className="mb-1">Prix (€)</p>
                        <Input
                            type="number"
                            onWheel={(event) => event.currentTarget.blur()}
                            onChange={(e) => handleChange("mealPrice", e.target.value)}
                            value={meal.mealPrice}
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-6 items-center">
                    <div>
                        <p className="mb-1">Ingrédients</p>
                        <MealIngredientSelector meal={meal} handleChange={handleChange} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            onClick={() => handleChange("indisponible", !meal.indisponible)}
                            checked={meal.indisponible}
                            id="terms"
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Marquer comme indisponible
                        </label>
                    </div>
                </div>
            </section>
            <section className="border rounded-md w-[750px] my-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Ingrédient</TableHead>
                            <TableHead className="w-[250px]">Quantité</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meal?.ingredients?.map((ingredient: any) => (
                            <TableRow key={ingredient._id}>
                                <TableCell className="font-medium">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger className="h-full">
                                                <p className="w-full text-left whitespace-nowrap truncate cursor-help">
                                                    {ingredient.name}
                                                </p>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{ingredient.name} </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell className="flex gap-2 items-center w-[250px]">
                                    <Input
                                        className="w-24"
                                        type="number"
                                        min="1"
                                        max="9999"
                                        onChange={(e) =>
                                            handleQty({
                                                item: ingredient,
                                                qty: parseInt(e.target.value),
                                            })
                                        }
                                        defaultValue={ingredient.qty}
                                    />
                                    {ingredient.units.symbol}
                                </TableCell>
                                <TableCell>
                                    <span className="h-8 w-8" />
                                    <Button
                                        onClick={() => handleDelete(ingredient)}
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
                    {meal.ingredients?.length === 0 && (
                        <TableCaption className="mb-4">Aucun élément selectionné</TableCaption>
                    )}
                </Table>
            </section>
            <Button onClick={handleSubmit}>Modifier le plat {title}</Button>
        </Appshell>
    );
}

export default EditMealPage;
