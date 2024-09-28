"use client"

import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/loadingScreen";

export default function Page({ params }: { params: { id: string } }) {
    const router = useRouter();  
     const { data, isValidating } = useSWR(
        `${process.env.NEXT_PUBLIC_URL}/api/estimates/transferOne?id=${params.id}`,
        fetcher
    );

    if(!isValidating) return <LoadingScreen label="Copie en cours" />
    
    if(data) {
        router.push(`/orders/${data._id}`);
        return <LoadingScreen label="Redirection" />
    }
};