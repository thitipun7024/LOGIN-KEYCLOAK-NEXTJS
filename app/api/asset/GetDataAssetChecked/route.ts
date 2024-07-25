import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const BranchCodeSearch = searchParams.get("resultGroupBranch")
    const SakHQCodeSearch = searchParams.get("SakHQ")
    const StatusWFA = "13";
    const StatusN = "1";
    const Asset_StatusA = "2";
    const Asset_StatusNA = "17";

    if (!BranchCodeSearch && !SakHQCodeSearch) {
        return NextResponse.json({ message: "ไม่มีข้อมูล" }, { status: 200 });
    }

    try {
        const getBranchCode = await prisma.assetMaster.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            BranchCodeSearch ? { Cost_Ctr: BranchCodeSearch } : undefined,
                            SakHQCodeSearch ? { Cost_Ctr: SakHQCodeSearch } : undefined,
                        ].filter(Boolean)
                    },
                    { 
                        OR: [
                            {Status: StatusWFA},
                            {Status: StatusN}
                        ]
                         
                    },
                    { 
                        OR: [
                            {Asset_Status: Asset_StatusA},
                            {Asset_Status: Asset_StatusNA},
                        ]
                         
                    }
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
