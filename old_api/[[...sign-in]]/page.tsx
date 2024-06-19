"use client";

import Image from "next/image";
import { SignIn } from "@clerk/nextjs";

export default async function Home() {
    return (
        <main className="h-screen w-screen flex flex-col items-center justify-center">
            <div>
                <Image src="/logo-full.svg" height={200} width={200} alt="Orderise" />
                <div className="-ml-14">
                    <SignIn afterSignInUrl="/" />
                </div>
            </div>
        </main>
    );
}
