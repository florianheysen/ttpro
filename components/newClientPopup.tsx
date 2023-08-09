import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

function NewClientPopup({ handleChange }: { handleChange: any }) {
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
        const res = await fetch("http://localhost:3000/api/createClient", {
            method: "POST",
            headers: {
                Accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ client: client }),
        });

        const result = await res.json();

        handleChange("client", result);
    };

    const handleClientChange = (field: string, newValue: unknown) => {
        setClient((prevState: any) => ({
            ...prevState,
            [field]: newValue,
        }));
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button variant="outline" className="h-9 w-9 p-0">
                                <span className="sr-only">Nouveau client</span>
                                <PlusIcon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Nouveau client</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Créer un nouveau client</AlertDialogTitle>
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
                                    type="text"
                                    id="name"
                                    placeholder="Jean Dupont"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="name">Adresse e-mail</Label>
                                <Input
                                    onChange={(e) => handleClientChange("email_address", e.target.value)}
                                    type="email"
                                    id="email"
                                    placeholder="jean@dupont.fr"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 w-full">
                            <Label htmlFor="name">Adresse postale</Label>
                            <Input
                                onChange={(e) => handleClientChange("postal_address", e.target.value)}
                                type="text"
                                id="postal_address"
                                placeholder="4 rue des grands lilas"
                            />
                        </div>
                        <div className="flex gap-6">
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="name">Ville</Label>
                                <Input
                                    onChange={(e) => handleClientChange("city", e.target.value)}
                                    type="text"
                                    id="city"
                                    placeholder="Hersin-Coupigny"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="name">Code postal</Label>
                                <Input
                                    onChange={(e) => handleClientChange("postal_code", e.target.value)}
                                    type="email"
                                    id="email"
                                    placeholder="62530"
                                />
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="name">Téléphone Portable</Label>
                                <Input
                                    onChange={(e) => handleClientChange("phone_port", e.target.value)}
                                    type="text"
                                    id="phone_port"
                                    placeholder="0600000000"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 w-1/2">
                                <Label htmlFor="name">Téléphone Fixe</Label>
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
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={createClient}>Créer et assigner</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default NewClientPopup;
