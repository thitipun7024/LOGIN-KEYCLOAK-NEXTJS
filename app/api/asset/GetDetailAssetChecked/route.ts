import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const NoAsset = searchParams.get("NoAsset")
    const StatusWFA = "7";
    const StatusN = "1";
    const StatusO = "14";
    const StatusWFAA = "17";
    const StatusWFAAA = "2";

    try {
        const getBranchCode = await prisma.assetMaster.findMany({
            where: {
                AND: [
                    { 
                        OR: [
                            {Status: StatusWFA},
                            {Status: StatusN},
                            {Status: StatusO},
                            {Status: StatusWFAA},
                            {Status: StatusWFAAA},
                        ]
                         
                    },
                    { Asset: NoAsset }
                ]
            }
        });

        if (getBranchCode.length === 0) { 
            return NextResponse.json({ message: "ไม่มีข้อมูลAsset" }, { status: 200 });
        } else {
            return NextResponse.json(getBranchCode);
        }
    } catch (error) {
        console.error('Error fetching branch code:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
