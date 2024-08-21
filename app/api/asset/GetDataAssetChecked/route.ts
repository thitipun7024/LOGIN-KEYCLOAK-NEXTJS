import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const BranchCodeSearch = searchParams.get("resultGroupBranch")
    const SakHQCodeSearch = searchParams.get("SakHQ")
    const Aset_StatusWFA = "7";
    const Asset_StatusN = "1";
    const Asset_StatusO = "14";
    const StatusNA = "17";
    const StatusA = "2";
    

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
                            {Status: Aset_StatusWFA},
                            {Status: Asset_StatusN},
                            {Status: Asset_StatusO},
                            {Status: StatusNA},
                            {Status: StatusA}
                        ]
                         
                    },
                    { 
                        OR: [
                            {Asset_Status: Aset_StatusWFA},
                            {Asset_Status: Asset_StatusN},
                            {Asset_Status: Asset_StatusO},
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
