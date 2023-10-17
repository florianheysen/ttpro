"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { fr } from "date-fns/locale";
import moment from "moment";

export function OrderDatePicker({ handleChange, order, data }: { order: any; handleChange: any; data?: any }) {
    const [date, setDate] = React.useState<Date | undefined>(
        order.delivery_date ? new Date(order.delivery_date) : new Date()
    );

    React.useEffect(() => {
        if (data?.delivery_date) {
            setDate(new Date(data.delivery_date));
        }
    }, [data]);

    React.useEffect(() => {
        handleChange("delivery_date", moment(date).format("YYYY-MM-DD"));
    }, [date, setDate]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
        </Popover>
    );
}
