import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pencil2Icon } from "@radix-ui/react-icons";

export function EditSpPopup({ handleChange, order, initialData }: { handleChange: any; order: any; initialData: any }) {
    const [isPopupOpen, setPopupOpen] = React.useState(false);
    const [ingredients, setIngredients]: any = React.useState([]);
    const [initialState, setInitialState]: any = React.useState([]);

    const [personnes, setPersonnes] = React.useState(initialData.personnes);

    const createPlateau = () => {
        const finalIngredients = ingredients.filter((i: any) => i.qty !== "0" && i.qty !== 0);

        let finalPrice = 0;

        finalIngredients.forEach((i: any) => {
            const prix = parseFloat(i.price);
            const quantite = parseInt(i.qty);
            finalPrice += prix * quantite;
        });

        const finalPlateau = {
            code: "SP",
            id: initialData.id,
            personnes,
            finalPrice,
            qty: initialData.qty,
            selectedIngredients: finalIngredients,
            comment: initialData.comment,
        };

        const indexElement = order.specialMeals.findIndex((sp: any) => sp.id === initialData.id);

        // Vérifier si l'élément avec l'ID donné a été trouvé
        if (indexElement !== -1) {
            // Remplacer l'élément par le nouvel élément
            order.specialMeals[indexElement] = finalPlateau;
        } else {
            console.log("Élément non trouvé dans le tableau.");
        }

        handleChange("specialMeals", order.specialMeals);

        setPopupOpen(false);
        setIngredients(initialState);
    };

    React.useEffect(() => {
        const updatedIngredients = ingredients.map((ingredient: any) => {
            if (ingredient._id === "f58730f70d1d46ed8d60a00a") {
                // Citron
                return {
                    ...ingredient,
                    qty: 1 * personnes,
                };
            }
            if (ingredient._id === "7f97851a1efb49df8b5adae3") {
                // Mayo
                return {
                    ...ingredient,
                    qty: 80 * personnes,
                };
            } else return ingredient;
        });
        setIngredients(updatedIngredients);
    }, [personnes, setPersonnes]);

    React.useEffect(() => {
        const getIngredientsSp = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ingredients/sp/findMany`, {
                method: "GET",
                headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
                },
            });

            const result = await res.json();

            // Parcourir l'array pour ajuster les quantités
            const modifiedIngredients = result.map((ingredient: any) => {
                if (
                    ingredient._id === "285af28604a340c5be59eabc" || // Petit plateau
                    ingredient._id === "1f148604c2eb4ba991bdde88" || // Grand plateau
                    ingredient._id === "f58730f70d1d46ed8d60a00a" // Citron jaune plateau
                ) {
                    return {
                        ...ingredient,
                        qty: "1",
                    };
                }
                if (ingredient._id === "7f97851a1efb49df8b5adae3") {
                    // Mayonnaise
                    return {
                        ...ingredient,
                        qty: "80",
                    };
                } else {
                    return {
                        ...ingredient,
                        qty: "0",
                    };
                }
            });

            function mettreAJourObjets(tableauOriginal: any, objetsAMettreAJour: any) {
                objetsAMettreAJour.forEach((objetMaj: any) => {
                    const index = tableauOriginal.findIndex((objet: any) => objet._id === objetMaj._id);
                    if (index !== -1) {
                        tableauOriginal[index] = objetMaj;
                    }
                });
            }

            mettreAJourObjets(modifiedIngredients, initialData.selectedIngredients);

            setIngredients(modifiedIngredients);
            setInitialState(modifiedIngredients);
        };

        getIngredientsSp();
    }, [initialData]);

    const handleQty = ({ id, qty }: { id: string; qty: number }) => {
        const nouveauIngredients = ingredients.map((ingr: any) => {
            if (ingr._id === id) {
                return {
                    ...ingr,
                    qty,
                };
            }
            return ingr;
        });
        setIngredients(nouveauIngredients);
    };

    return (
        <AlertDialog open={isPopupOpen}>
            <AlertDialogTrigger>
                <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setPopupOpen(true)}>
                    <span className="sr-only">Modifier</span>
                    <Pencil2Icon className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[40rem]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex justify-between">
                        <span>Modifier plateau spécial</span>
                        <div className="flex items-center gap-3">
                            <div className="grid w-32 items-center gap-1.5">
                                <Label htmlFor="personnes">Personnes</Label>
                                <Input
                                    value={personnes}
                                    onChange={(e) => setPersonnes(parseInt(e.target.value))}
                                    type="number"
                                    id="personnes"
                                    placeholder="1"
                                />
                            </div>
                            {/* <div className="flex flex-col justify-start h-full items-center gap-2">
                                <Label htmlFor="terms1">Mayo</Label>
                                <Checkbox className="h-8 w-8" id="terms1" />
                            </div>
                            <div className="flex flex-col justify-start h-full items-center gap-2">
                                <Label htmlFor="terms1">Citron</Label>
                                <Checkbox className="h-8 w-8" id="terms1" />
                            </div> */}
                        </div>
                    </AlertDialogTitle>
                    <br />
                    <section className="border rounded-md overflow-hidden">
                        <Table id="spselector">
                            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Qté</TableHead>
                                    <TableHead className="w-[100px]">Unité</TableHead>
                                    <TableHead className="w-[300px]">Ingrédient</TableHead>
                                    <TableHead className="w-[110px]">Prix/Unité</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ingredients.map((ingredient: any) => (
                                    <TableRow key={ingredient._id}>
                                        <TableCell className="font-medium w-[80px]">
                                            <Input
                                                onChange={(e) =>
                                                    handleQty({
                                                        id: ingredient._id,
                                                        qty: parseInt(e.target.value),
                                                    })
                                                }
                                                type="number"
                                                value={ingredient.qty}
                                            />
                                        </TableCell>
                                        <TableCell className="w-[100px]">{ingredient.unit.name}</TableCell>
                                        <TableCell className="w-[300px]">{ingredient.name}</TableCell>
                                        <TableCell className="w-[110px]">
                                            {new Intl.NumberFormat("fr-FR", {
                                                style: "currency",
                                                currency: "EUR",
                                            }).format(ingredient.price)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </section>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-2">
                    <AlertDialogCancel onClick={() => setPopupOpen(false)}>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={createPlateau}>Ajouter à la commande</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
