"use client"

import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useRouter } from "next/navigation";


export default function Page({ params }: { params: { id: string } }) {
    const router = useRouter();

    const { data, isValidating } = useSWR(
        `${process.env.NEXT_PUBLIC_URL}/api/estimates/transferOne?id=${params.id}`,
        fetcher
    );

    if(isValidating) return <div>Loading...</div>
    
    if(data) {
        router.push(`/orders/${data._id}`);
        return <div>Redirecting...</div>
    }
};