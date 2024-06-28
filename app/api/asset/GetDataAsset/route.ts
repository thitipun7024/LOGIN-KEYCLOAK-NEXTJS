import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const BranchCodeSearch = searchParams.get("resultGroupBranch")
    const SakHQCodeSearch = searchParams.get("SakHQ")
    const Status = "16";

    if (!BranchCodeSearch && !SakHQCodeSearch) {
        return NextResponse.json({ message: "ไม่มีข้อมูล" }, { status: 200 });
    }

    try {
        const getBranchCode = await prisma.no_Asset.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            BranchCodeSearch ? { Cost_Ctr: BranchCodeSearch } : undefined,
                            SakHQCodeSearch ? { Cost_Ctr: SakHQCodeSearch } : undefined,
                        ].filter(Boolean)
                    },
                    { Status: Status }
                ]
            }
        });

        if (getBranchCode.length === 0) { 
            return NextResponse.json({ message: "ไม่มีข้อมูล" }, { status: 200 });
        } else {
            return NextResponse.json(getBranchCode);
        }
    } catch (error) {
        console.error('Error fetching branch code:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
