import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const currentYear = new Date().getFullYear();
        const pastYear = currentYear - 1;

        const currentYearDateRange = {
            start: new Date(`${currentYear}-11-10`),
            end: new Date(`${currentYear}-12-31`),
        };

        const pastYearDateRange = {
            start: new Date(`${pastYear}-11-10`),
            end: new Date(`${pastYear}-12-31`),
        };

        const convertDate = (dateField: any): Date => {
            if (typeof dateField === "string") {
                return new Date(dateField);
            }
            if (dateField instanceof Date) {
                return dateField;
            }
            return new Date(0);
        };

        const allOrders = await db.collection("orders").find().toArray();

        const currentYearOrders = allOrders
            .filter((order) => {
                const orderDate = convertDate(order.created_at);
                const isValid = orderDate instanceof Date && !isNaN(orderDate.getTime());
                const isInRange =
                    isValid && orderDate >= currentYearDateRange.start && orderDate <= currentYearDateRange.end;
                return isInRange;
            })
            .map((order) => ({
                date: convertDate(order.created_at),
            }));

        const pastYearOrders = allOrders
            .filter((order) => {
                const orderDate = convertDate(order.created_at);
                const isValid = orderDate instanceof Date && !isNaN(orderDate.getTime());
                const isInRange = isValid && orderDate >= pastYearDateRange.start && orderDate <= pastYearDateRange.end;
                return isInRange;
            })
            .map((order) => ({
                date: convertDate(order.created_at),
            }));

        const countOrdersByDay = (orders: any) => {
            return orders.reduce((acc: any, order: any) => {
                const date = order.date.toISOString().split("T")[0];
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});
        };

        const generateDateRange = (startDate: Date, endDate: Date) => {
            const dates = [];
            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                dates.push(currentDate.toISOString().split("T")[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
        };

        const currentYearDates = generateDateRange(currentYearDateRange.start, currentYearDateRange.end);
        const pastYearDates = generateDateRange(pastYearDateRange.start, pastYearDateRange.end);

        const mergeCountsWithDates = (counts: any, dates: any) => {
            return dates.reduce((acc: any, date: any) => {
                acc[date] = counts[date] || 0;
                return acc;
            }, {});
        };

        const currentYearOrdersCount = mergeCountsWithDates(countOrdersByDay(currentYearOrders), currentYearDates);
        const pastYearOrdersCount = mergeCountsWithDates(countOrdersByDay(pastYearOrders), pastYearDates);

        const obj = {
            currentYear: {
                ...currentYearOrdersCount,
            },
            pastYear: {
                ...pastYearOrdersCount,
            },
        };

        let result = [];

        for (let date in obj.currentYear) {
            let shortDate = date;
            result.push({
                date: shortDate,
                currentYear: obj.currentYear[date],
                pastYear: obj.pastYear[date.replace(currentYear.toString(), pastYear.toString())],
            });
        }

        const totalOrders = {
            currentYear: result.reduce((a: any, b: any) => a + b.currentYear, 0),
            pastYear: result.reduce((a: any, b: any) => a + b.pastYear, 0),
        };

        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Une erreur s'est produite lors de la récupération des données" },
            { status: 500 }
        );
    }
}
