import React from "react";
import useSWR from "swr";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import Loading from "./loading";

interface ISellerSelectorPopupProps {
    order: any;
    handleChange: any;
    isDefaultOpen: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SellerSelectorPopup({ order, handleChange, isDefaultOpen }: ISellerSelectorPopupProps) {
    const { data: sellers } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/sellers/findMany`, fetcher);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsOpen(isDefaultOpen);
        }, 200);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button className="text-left w-[185px]" variant="outline">
                    {order.seller === null ? "Choisir un vendeur" : order.seller}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Qui êtes-vous ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Choisir le vendeur associé à cette commande ci-dessous afin de poursuivre la saisie.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {!sellers ? (
                    <Loading />
                ) : (
                    <RadioGroup defaultValue={order.seller} onValueChange={(value) => handleChange("seller", value)}>
                        {sellers.map((vendeur: any) => (
                            <div
                                key={vendeur._id}
                                className="flex items-center bg-gray-100 dark:bg-zinc-900 rounded pl-4"
                            >
                                <RadioGroupItem value={vendeur.name} id={vendeur._id} />
                                <Label className="w-full h-full px-4 py-4 cursor-pointer" htmlFor={vendeur._id}>
                                    {vendeur.name}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel>Fermer</AlertDialogCancel>
                    <AlertDialogAction>Valider</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
