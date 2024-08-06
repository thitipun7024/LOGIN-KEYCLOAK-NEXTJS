import { NextResponse } from 'next/server';
export async function GET() {
        const a =process.env.SMARTCARD_URI
    return NextResponse.json({ uri: a });
}