"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CustomMessage = {
    _id?: string;
    type: "customMessage";
    content: string;
};

export function CustomMessagePopup() {
    const [customMessage, setCustomMessage] = React.useState<CustomMessage>({
        _id: "6671c2dcf99ac29e5934bcb0",
        type: "customMessage",
        content: "Example",
    });
    const [isPopupOpen, setPopupOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const settingsRes = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/settings/findOne?id=6671c2dcf99ac29e5934bcb0`
                );
                const settingsData = await settingsRes.json();

                setCustomMessage(settingsData);
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isPopupOpen]);

    const handleSubmit = async () => {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/settings/updateOne`, {
            method: "POST",
            headers: {
                Accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ settings: customMessage }),
        });

        const result = await res.json();

        console.log("result", result);
        setIsLoading(false);
        setPopupOpen(false);
    };

    return (
        <Dialog open={isPopupOpen} onOpenChange={setPopupOpen}>
            <DialogTrigger asChild>
                <p
                    onClick={() => setPopupOpen(true)}
                    className="text-primary text-sm underline-offset-4 hover:underline cursor-pointer"
                >
                    Messages personnalisés
                </p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Messages personnalisés</DialogTitle>
                    <DialogDescription>
                        Modifiez les messages ici. Cliquez sur Enregistrer lorsque vous avez terminé.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid w-full gap-1.5 mt-4 mb-2">
                    <Label htmlFor="bon2commande">Bon de commande</Label>
                    <Textarea
                        value={customMessage.content}
                        disabled={isLoading}
                        onChange={(e) =>
                            setCustomMessage({
                                _id: "6671c2dcf99ac29e5934bcb0",
                                type: "customMessage",
                                content: e.target.value,
                            })
                        }
                        id="bon2commande"
                    />
                    <p className="text-xs text-muted-foreground">
                        Ce message s&apos;affiche en haut à droite du bon de commande
                    </p>
                </div>
                <DialogFooter>
                    <Button disabled={isLoading} onClick={handleSubmit} type="submit">
                        {isLoading ? "Chargement..." : "Enregistrer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
