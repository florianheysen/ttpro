"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePickerWithRange({
    className,
    date: propDate,
    setDate: propSetDate,
}: {
    className?: string;
    date: DateRange | undefined;
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !propDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {propDate?.from ? (
                            propDate.to ? (
                                <>
                                    {format(propDate.from, "LLL dd, y", { locale: fr })} -{" "}
                                    {format(propDate.to, "LLL dd, y", { locale: fr })}
                                </>
                            ) : (
                                format(propDate.from, "LLL dd, y", { locale: fr })
                            )
                        ) : (
                            <span>Choisir une date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={propDate?.from}
                        selected={propDate}
                        onSelect={propSetDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
