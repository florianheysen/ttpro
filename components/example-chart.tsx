"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { tr } from "date-fns/locale";

const chartConfig = {
    orders: {
        label: "Commandes",
    },
    currentYear: {
        label: "2024",
        color: "hsl(var(--chart-1))",
    },
    pastYear: {
        label: "2023",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function ExampleChart({ chartData }: { chartData: any }) {
    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Commandes / jour</CardTitle>
                    <CardDescription>Comparaison journalière des commandes avec l&apos;année dernière</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="fillCurrentYear" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-currentYear)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-currentYear)" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillPastYear" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-pastYear)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-pastYear)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("fr-FR", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("fr-FR", {
                                            month: "short",
                                            day: "numeric",
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="pastYear"
                            type="natural"
                            fill="url(#fillPastYear)"
                            stroke="var(--color-pastYear)"
                            stackId="a"
                            dot={true}
                        />
                        <Area
                            dataKey="currentYear"
                            type="natural"
                            fill="url(#fillCurrentYear)"
                            stroke="var(--color-currentYear)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
