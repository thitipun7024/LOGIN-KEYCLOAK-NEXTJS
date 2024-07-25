import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function PUT(req: NextRequest) {
    if (req.method !== 'PUT') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const { Detail, Status, Asset_status } = await req.json();

    try {
        const updateAsset = await prisma.assetMaster.update({
            where: { Asset: "300000000797" },
            data: {
                Description: Detail,
                Status: Status,
                Asset_Status: Asset_status
            }
        });

        return NextResponse.json(updateAsset, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
    }
}
