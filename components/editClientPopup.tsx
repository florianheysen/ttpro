import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

import { toast } from "sonner";

export function EditClientPopup({ order, handleChange }: { order: any; handleChange: any }) {
    const [isPopupOpen, setPopupOpen] = React.useState(false);
    const [client, setClient] = React.useState(order.client);

    const createClient = async () => {
        if (client.name.trim() != "") {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/clients/updateOne`, {
                method: "POST",
                headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client: client,
                }),
            });

            const result = await res.json();

            handleChange("client", result);
            setPopupOpen(false);
        } else {
            toast.error("Veuillez renseigner un nom");
        }
    };

    const handleClientChange = (field: string, newValue: unknown) => {
        setClient((prevState: any) => ({
            ...prevState,
            [field]: newValue,
        }));
    };

    return (
        <AlertDialog open={isPopupOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Button onClick={() => setPopupOpen(true)} variant="outline" className="h-9 w-9 p-0">
                            <span className="sr-only">Modifier le client</span>
                            <PencilIcon className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Modifier le client</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Modifier le client</AlertDialogTitle>
                    <AlertDialogDescription>
                        Modifier la fiche client et l&apos;assigner à nouveau à la prise de commande en cours.
                    </AlertDialogDescription>

                    <br />
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-6">
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="name">Nom complet</Label>
                                <Input
                                    defaultValue={order.client.name}
                                    onChange={(e) => handleClientChange("name", e.target.value)}
                                    autoFocus={true}
                                    type="text"
                                    id="name"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="email">Adresse e-mail</Label>
                                <Input
                                    defaultValue={order.client.email_address}
                                    onChange={(e) => handleClientChange("email_address", e.target.value)}
                                    type="email"
                                    id="email"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 w-full">
                            <Label htmlFor="postal_address">Adresse postale</Label>
                            <Input
                                defaultValue={order.client.postal_address}
                                onChange={(e) => handleClientChange("postal_address", e.target.value)}
                                type="text"
                                id="postal_address"
                            />
                        </div>
                        <div className="flex gap-6">
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="city">Ville</Label>
                                <Input
                                    defaultValue={order.client.city}
                                    onChange={(e) => handleClientChange("city", e.target.value)}
                                    type="text"
                                    id="city"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="postal_code">Code postal</Label>
                                <Input
                                    defaultValue={order.client.postal_code}
                                    onChange={(e) => handleClientChange("postal_code", e.target.value)}
                                    type="text"
                                    id="postal_code"
                                />
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="phone_port">Téléphone Portable</Label>
                                <Input
                                    defaultValue={order.client.phone_port}
                                    onChange={(e) => handleClientChange("phone_port", e.target.value)}
                                    type="text"
                                    id="phone_port"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="phone_fixe">Téléphone Fixe</Label>
                                <Input
                                    defaultValue={order.client.phone_fixe}
                                    onChange={(e) => handleClientChange("phone_fixe", e.target.value)}
                                    type="email"
                                    id="phone_fixe"
                                />
                            </div>
                        </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-2">
                    <AlertDialogCancel onClick={() => setPopupOpen(false)}>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={createClient}>Modifier et assigner</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
