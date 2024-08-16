import prisma from '../../../../lib/prisma';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const Create_by: string | null = searchParams.get('Create_by');
    const Branch: string | null = searchParams.get('Branch');
    const Action: string | null = searchParams.get('Action');
    const ActionDetail: string | null = searchParams.get('ActionDetail');
    const Asset: string | null = searchParams.get('Asset');
    const BranchAsset: string | null = searchParams.get('BranchAsset');

    const Action_datetime = new Date(Date.now() + 7 * 3600 * 1000);

    try {
        const result = await prisma.asset_Log.create({
            data: {
                Action_datetime,
                Create_by,
                Branch,
                Action,
                Action_detail: ActionDetail,
                Asset,
                Branch_asset: BranchAsset
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error creating asset log:", error);
        return NextResponse.json({ error: 'Failed to create asset log' }, { status: 500 });
    }
}
