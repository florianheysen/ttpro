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
import { PlusIcon } from "lucide-react";

import { toast } from "sonner";

export function NewClientPopup({ handleChange }: { handleChange: any }) {
    const [isPopupOpen, setPopupOpen] = React.useState(false);

    const [isSubmitting, SetIsSubmitting] = React.useState(false);
    const [client, setClient] = React.useState({
        name: "",
        email_address: "",
        inserted_at: "",
        postal_address: "",
        city: "",
        postal_code: "",
        phone_fixe: "",
        phone_port: "",
    });

    const createClient = async () => {
        if (client.name.trim() != "") {
            SetIsSubmitting(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/clients/insertOne`, {
                method: "POST",
                headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ client: client }),
            });

            const result = await res.json();

            handleChange("client", result);
            SetIsSubmitting(false)
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
                            <PlusIcon className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Nouveau client</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Nouveau client</AlertDialogTitle>
                    <AlertDialogDescription>
                        Créer une nouvelle fiche client et assigner directement à la prise de commande en cours.
                    </AlertDialogDescription>

                    <br />
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-6">
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="name">Nom complet</Label>
                                <Input
                                    onChange={(e) => handleClientChange("name", e.target.value)}
                                    autoFocus={true}
                                    type="text"
                                    id="name"
                                    placeholder="Jean Dupont"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="email">Adresse e-mail</Label>
                                <Input
                                    onChange={(e) => handleClientChange("email_address", e.target.value)}
                                    type="email"
                                    id="email"
                                    placeholder="jean@dupont.fr"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 w-full">
                            <Label htmlFor="postal_address">Adresse postale</Label>
                            <Input
                                onChange={(e) => handleClientChange("postal_address", e.target.value)}
                                type="text"
                                id="postal_address"
                                placeholder="4 rue des grands lilas"
                            />
                        </div>
                        <div className="flex gap-6">
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="city">Ville</Label>
                                <Input
                                    onChange={(e) => handleClientChange("city", e.target.value)}
                                    type="text"
                                    id="city"
                                    placeholder="Hersin-Coupigny"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="postal_code">Code postal</Label>
                                <Input
                                    onChange={(e) => handleClientChange("postal_code", e.target.value)}
                                    type="text"
                                    id="postal_code"
                                    placeholder="62530"
                                />
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="phone_port">Téléphone Portable</Label>
                                <Input
                                    onChange={(e) => handleClientChange("phone_port", e.target.value)}
                                    type="text"
                                    id="phone_port"
                                    placeholder="0600000000"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="phone_fixe">Téléphone Fixe</Label>
                                <Input
                                    onChange={(e) => handleClientChange("phone_fixe", e.target.value)}
                                    type="email"
                                    id="phone_fixe"
                                    placeholder="0300000000"
                                />
                            </div>
                        </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-2">
                    <AlertDialogCancel onClick={() => setPopupOpen(false)}>Annuler</AlertDialogCancel>
                    <AlertDialogAction disabled={isSubmitting} onClick={createClient}>{isSubmitting ? 'Création en cours...' : 'Créer et assigner'}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
