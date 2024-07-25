import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const BranchCodeSearch = searchParams.get("resultGroupBranch")
    const SakHQCodeSearch = searchParams.get("SakHQ")
    const Status = "16";

    try {
        const countNoChecked = await prisma.assetMaster.count({
            where: {
                AND:[
                    {
                        OR: [
                        BranchCodeSearch ? { Cost_Ctr: BranchCodeSearch } : {},
                        SakHQCodeSearch ? { Cost_Ctr: SakHQCodeSearch } : {},
                    ].filter(Boolean)
                },
                    { Status: Status },
                ]
            }
        });
        
        if(countNoChecked !== undefined) {
            const responseData = {
                countAssetNoChecked: countNoChecked
            };
            return NextResponse.json(responseData);
        } else {
            console.error("Error: No Data");
            return NextResponse.json({ error: 'No Data' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error fetching count:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
