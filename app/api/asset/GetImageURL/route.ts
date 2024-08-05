import { NextResponse } from "next/server";

export async function GET() {
        if(process.env.NEXT_PUBLIC_SMARTCARD_URI !== null){
        return NextResponse.json(process.env.NEXT_PUBLIC_SMARTCARD_URI);
        }
        return NextResponse.json("no env");
}