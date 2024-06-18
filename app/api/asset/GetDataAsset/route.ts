import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const BranchCodeSearch = searchParams.get("resultGroupBranch")

    if (!BranchCodeSearch) {
        return NextResponse.json({ error: 'BranchCode is required' }, { status: 400 });
    }

    try {
        const getBranchCode = await prisma.assetMaster.findMany({
            where: {
                BranchCode: BranchCodeSearch,
            },
        });
        return NextResponse.json(getBranchCode);
    } catch (error) {
        console.error('Error fetching branch code:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
