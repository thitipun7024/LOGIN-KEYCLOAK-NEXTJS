import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const AssetCode: string | null = searchParams.get("AssetCode");
    const Status: string | null = searchParams.get("Status");
    const Branch: string | null = searchParams.get("Branch");
    const Comment: string | null = searchParams.get("Comment");
    const CreateBy: string | null = searchParams.get("CreateBy");
    const fileupload: string | null = searchParams.get("fileupload");
    const Description: string | null = searchParams.get("Description");

    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
    else{
  
        try {
            const updateAsset = await prisma.$queryRaw`
            DECLARE @AssetCode nvarchar(30) = ${AssetCode}
            DECLARE @Status nvarchar(30) = ${Status}
            DECLARE @Branch nvarchar(30) = ${Branch}
            DECLARE @Comment nvarchar(500) = ${Comment}
            DECLARE @CreateBy nvarchar(50) = ${CreateBy}
            DECLARE @CheckerBy nvarchar(50) = ${CreateBy}
            DECLARE @fileupload nvarchar(max) = ${fileupload}
            DECLARE @Description nvarchar(100) = ${Description}
            EXECUTE [dbo].[InsertTrackingData] 
            @AssetCode
            ,@Status
            ,@Branch
            ,@Comment
            ,@CreateBy
            ,@CheckerBy
            ,@fileupload
            ,@Description
            `
    
            return NextResponse.json(updateAsset, { status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: error }, { status: 500 });
        }
    }
}
