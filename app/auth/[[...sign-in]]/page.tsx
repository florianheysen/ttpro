'use client';

import Image from "next/image";
import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { SymbolIcon } from '@radix-ui/react-icons';

export default async function Home() {
    return (
        <main className="h-screen w-screen flex flex-col items-center justify-center">
            <ClerkLoading>
                <SymbolIcon className="animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
                <div>
                    <Image src="/logo-full.svg" height={200} width={200} alt="Traiteur Pro" />
                    <div className="-ml-14">
                        <SignIn afterSignInUrl="/" />
                    </div>
                </div>
            </ClerkLoaded>
        </main>
    )
  }