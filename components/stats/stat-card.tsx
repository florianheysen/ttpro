import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string;
    percentageChange: string;
    icon?: ReactNode;
}

export default function StatCard({ title, value, percentageChange, icon }: StatCardProps) {
    return (
        <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{percentageChange} de l'année dernière</p>
            </CardContent>
        </Card>
    );
}
