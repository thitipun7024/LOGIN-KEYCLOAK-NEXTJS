import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

        return NextResponse.json(process.env.MINIO_BUCKET);

}