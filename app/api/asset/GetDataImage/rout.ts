import prisma from '../../../../lib/prisma';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const FileIdString = searchParams.get("fileId");

    if (!FileIdString) {
        return NextResponse.json({ error: 'fileid parameter is required' }, { status: 400 });
    }

    const FileId: number = parseInt(FileIdString, 10);

    if (isNaN(FileId)) {
        return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    try {
        const getfleimage = await prisma.tblfilemanagement.findMany();

        return NextResponse.json(getfleimage);
    } catch (error: any) {
        console.error('Error fetching file image:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}