"use client";

import Image from "next/image";
import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { SymbolIcon } from "@radix-ui/react-icons";

export default async function Home() {
    return (
        <main className="h-screen w-screen flex flex-col items-center justify-center">
            <ClerkLoading>
                <SymbolIcon className="animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
                <div className="flex justify-center items-center w-screen h-screen">
                    <div className="flex flex-col w-[200]">
                        <div className="ml-[60px]">
                            <Image src="/logo-full.svg" height={200} width={160} alt="Traiteur Pro" />
                            <h1 className="mt-8 text-2xl font-semibold">Bon retour parmi nous</h1>
                        </div>
                        <SignIn afterSignInUrl="/" /> 
                    </div>
                </div>
            </ClerkLoaded>
        </main>
    );
}
