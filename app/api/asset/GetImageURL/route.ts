import { NextResponse } from 'next/server';

export async function GET() {
        return NextResponse.json(process.env.NEXT_PUBLIC_SMARTCARD_URI);
}