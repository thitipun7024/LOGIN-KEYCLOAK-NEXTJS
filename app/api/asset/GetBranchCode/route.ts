import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const BranchCode = searchParams.get("BranchCode")

    if (!BranchCode) {
        return NextResponse.json({ message: "ไม่มีเลขสาขา" }, { status: 200 });
    }

    try {
        const getBranchCode = await prisma.asset_Branch_Code.findMany({
            where: {
                CostCenter: BranchCode
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
