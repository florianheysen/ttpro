import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(){
    return NextResponse.json({res: "ok"});
}