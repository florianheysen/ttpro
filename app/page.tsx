import Appshell from "@/components/appshell";
import { CustomMessagePopup } from "@/components/customMessagePopup";
import { Button as Ok } from "@/components/ui/button";

import Link from "next/link";

export const metadata = {
    title: "Tableau de bord | Orderise",
};

export default function Home() {
    return (
        <Appshell>
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-4">
                    <p className="flex gap-2 text-sm">
                        <span className="opacity-40">Tableau de bord</span>
                        <span className="opacity-40">/</span>
                        <span className="font-medium">Accueil</span>
                    </p>
                    <div>
                        <h1 className="text-3xl font-semibold">
                            Bienvenue sur <b className="font-bold">Orderise</b>
                        </h1>
                        <p className="opacity-70">Voici quelques liens qui vous seront utiles :</p>
                    </div>
                </div>
            </div>
            <section className="flex w-2/3 flex-row justify-between mt-8">
                <div className="flex flex-col justify-between ">
                    <span className="text-sm font-medium">Commandes</span>
                    <Link href="/orders/create">
                        <Ok size="lg">Nouvelle commande</Ok>
                        {/* <Button.Root>
                            <Button.Label>Click me</Button.Label>
                        </Button.Root> */}
                    </Link>
                    <Link className="text-primary text-sm underline-offset-4 hover:underline" href="/orders/">
                        Toutes les commandes
                    </Link>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Comptes rendus</span>
                    <ul className="flex flex-col gap-2">
                        <li>
                            <a className="text-primary text-sm underline-offset-4 hover:underline" href="/">
                                Plats chauds
                            </a>
                        </li>
                        <li>
                            <a className="text-primary text-sm underline-offset-4 hover:underline" href="/">
                                Plats froids
                            </a>
                        </li>
                        <li>
                            <a className="text-primary text-sm underline-offset-4 hover:underline" href="/">
                                Plateaux P1 à P5
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Paramètres</span>
                    <ul className="flex flex-col gap-2">
                        <li>
                            <Link
                                className="text-primary text-sm underline-offset-4 hover:underline"
                                href="/ingredients"
                            >
                                Tous les ingrédients
                            </Link>
                        </li>
                        <li>
                            <CustomMessagePopup />
                        </li>
                        <li>
                            <a className="text-primary text-sm underline-offset-4 hover:underline" href="/">
                                Informations du logiciel
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
        </Appshell>
    );
}
