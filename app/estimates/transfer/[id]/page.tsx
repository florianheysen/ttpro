"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/loadingScreen";

export default function Page({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/estimates/transferOne?id=${params.id}`
                );
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (isLoading) return <LoadingScreen label="Loading..." />;

    if (data) {
        router.push(`/orders/${data._id}`);
        return <LoadingScreen label="Redirecting..." />;
    }

    return <LoadingScreen label="An error occurred or no data available" />;
}
